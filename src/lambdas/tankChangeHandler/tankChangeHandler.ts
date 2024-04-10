import { GetRecordsOutput } from "@aws-sdk/client-dynamodb-streams";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, PutCommandOutput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Event, AilmentEvent, ParameterEvent, RecentProductEvent, WaterChangeEvent } from "../../interfaces/eventInterface";
import { Tank, Ailment, LightSettings, Parameter, TestSchedule } from "../../interfaces/tankInterface";
import { Product } from "../../interfaces/productInterface";
import { TABLE } from "../../constants/tableEnum";
import { EVENT } from "../../constants/eventEnum";
import { PRODUCT_TYPE } from "../../constants/productEnum";
import { RESPONSE_MESSAGE } from "../../constants/responseMessageEnum";
import { sortAilmentArrayByName, sortParametersArrayByParameter, sortTestScheduleArrayByParameter } from "../../functions/sortData";
import { checkObjectImagesEqual, checkArrayOfObjectImagesEqual } from "../../functions/checkObjectEquality";
import { getAilmentsDifference, getArrayOfObjectsDifference, getParameterDifference, getTankInhabitantsDifference, getTestScheduleDifference } from "../../functions/getDataDifference";

interface GetProductTypeResponse {
  data: string | undefined,
  message: string
}

interface PutTankEventResponse {
  data: PutCommandOutput | undefined,
  message: string
}

exports.handler = async (event: GetRecordsOutput, context: any, callback: any) => {
  if (!event.Records) {
    return;
  }

  for (const record of event.Records) {
    console.log(JSON.stringify(record));

    if (!record.dynamodb?.OldImage) {
      return;
    }
    if (!record.dynamodb?.NewImage) {
      return;
    }

    const oldImage = unmarshall(record.dynamodb?.OldImage) as Tank;
    const newImage = unmarshall(record.dynamodb?.NewImage) as Tank;
    // console.log(oldImage);
    // console.log(newImage);

    // Determine event type based on change
    const eventType = await determineEventType(oldImage, newImage) as string;
    if (eventType === EVENT.NONE) {
      return;
    }
    // Not detecting event for change in array of objects when arrays are of equal length?
    console.log(eventType);

    const event = await createEventObject(eventType, oldImage, newImage);
    if (!event || !event.update) {
      return;
    }
    console.log(event);

    await createEventDBEntry(event);
  }
}

const determineEventType = async (oldImage: Tank, newImage: Tank): Promise<string> => {
  if (oldImage.is_cycled !== newImage.is_cycled) {
    return checkCycleEvent(oldImage.is_cycled, newImage.is_cycled);
  }

  if (oldImage.temperature_setting !== newImage.temperature_setting) {
    return EVENT.TEMPERATURE_SETTING_CHANGED;
  }

  if (!checkObjectImagesEqual(oldImage.recent_water_change, newImage.recent_water_change)) {
    return EVENT.WATER_CHANGE;
  }

  if (!checkObjectImagesEqual(oldImage.recent_water_fertilizer, newImage.recent_water_fertilizer)) {
    return EVENT.WATER_COLUMN_FERTILIZED;
  }

  if (!checkObjectImagesEqual(oldImage.recent_substrate_fertilizer, newImage.recent_substrate_fertilizer)) {
    return EVENT.SUBSTRATE_FERTILIZED;
  }

  if (!checkObjectImagesEqual(oldImage.recent_product, newImage.recent_product)) {
    const productType = await getProductTypeByName(newImage.recent_product.name);

    if (productType) {
      switch (productType as unknown as string) {
        case PRODUCT_TYPE.ALGICIDE:
          return EVENT.ALGICIDE_ADDED;
        case PRODUCT_TYPE.BACTERIA:
          return EVENT.BACTERIA_ADDED;
        case PRODUCT_TYPE.BIOFILM:
          return EVENT.BIOFILM_ADDED;
        case PRODUCT_TYPE.FOOD:
          return EVENT.LIVESTOCK_FED;
        case PRODUCT_TYPE.MEDICATION:
          return EVENT.MEDICATION_ADDED;
        case PRODUCT_TYPE.SUBSTRATE_FERTILIZER:
          return EVENT.SUBSTRATE_FERTILIZED;
        case PRODUCT_TYPE.WATER_COLUMN_FERTILIZER:
          return EVENT.WATER_COLUMN_FERTILIZED;
        default:
          return EVENT.PRODUCT_ADDED;
      }
    }

    // TODO: Handle product not in db
    // Will handle product not in db before attempting to add it to tank
    // This will exist to handle internal issues
    // When no type is returned, default to simply EVENT.PRODUCT_ADDED
    return EVENT.PRODUCT_ADDED;
  }


  // EVENT._DIED to be used in a more specific scenario
  const livestock_oldImage = oldImage.livestock;
  const livestock_newImage = newImage.livestock;
  if (livestock_oldImage.length < livestock_newImage.length) {
    return EVENT.LIVESTOCK_ADDED;
  }
  else if (livestock_oldImage.length > livestock_newImage.length) {
    return EVENT.LIVESTOCK_REMOVED;
  }


  const plants_oldImage = oldImage.plants;
  const plants_newImage = newImage.plants;
  if (plants_oldImage.length < plants_newImage.length) {
    return EVENT.PLANT_ADDED;
  }
  else if (plants_oldImage.length > plants_newImage.length) {
    return EVENT.PLANT_REMOVED;
  }


  const lightSettings_oldImage = oldImage.light_settings as LightSettings;
  const lightSettings_newImage = newImage.light_settings as LightSettings;
  if (!checkObjectImagesEqual(lightSettings_oldImage, lightSettings_newImage)) {
    return EVENT.LIGHT_SETTINGS_CHANGED;
  }


  const parameters_oldImage = oldImage.parameters as Parameter[];
  const parameters_newImage = newImage.parameters as Parameter[];
  // Necessary to differentiate between parameter addition & parameter removal?
  // Not intended to be removed once tested as timestamp will accompany each parameter to communicate its relevance
  // Always expect one addition or one change to an existing parameter
  if (parameters_oldImage.length < parameters_newImage.length) {
    return EVENT.PARAMETER_TESTED;
  }

  const sortedParameters_oldImage = parameters_oldImage.sort(sortParametersArrayByParameter);
  const sortedParameters_newImage = parameters_newImage.sort(sortParametersArrayByParameter);
  if (!checkArrayOfObjectImagesEqual(sortedParameters_oldImage, sortedParameters_newImage)) {
    return EVENT.PARAMETER_TESTED;
  }


  const testSchedule_oldImage = oldImage.test_schedule as TestSchedule[];
  const testSchedule_newImage = newImage.test_schedule as TestSchedule[];
  // Necessary to differentiate between test schedule addition & removal?
  // Always expect one addition, change, or removal
  if (testSchedule_oldImage.length !== testSchedule_newImage.length) {
    return EVENT.TEST_SCHEDULE_CHANGED;
  }

  const sortedTestSchedule_oldImage = testSchedule_oldImage.sort(sortTestScheduleArrayByParameter);
  const sortedTestSchedule_newImage = testSchedule_newImage.sort(sortTestScheduleArrayByParameter);
  if (!checkArrayOfObjectImagesEqual(sortedTestSchedule_oldImage, sortedTestSchedule_newImage)) {
    return EVENT.TEST_SCHEDULE_CHANGED;
  }


  // TODO: Add method for changing dx without needing to mark ailment as cured
  const ailment_oldImage = oldImage.ailments.sort(sortAilmentArrayByName) as Ailment[];
  const ailment_newImage = newImage.ailments.sort(sortAilmentArrayByName) as Ailment[];
  if (ailment_oldImage.length < ailment_newImage.length) {
    return EVENT.AILMENT_DX;
  }
  else if (ailment_oldImage.length > ailment_newImage.length) {
    return EVENT.AILMENT_CURED;
  }

  return EVENT.NONE;
}

const checkCycleEvent = (isCycled_oldImage: boolean, isCycled_newImage: boolean): string => {
  // EVENT.CYCLE_STARTED to be used in a more specific scenario
  if (isCycled_oldImage) {
    return EVENT.CYCLE_CRASHED;
  }
  return EVENT.CYCLE_COMPLETE;
}

const createEventObject = async (eventType: string, oldImage: Tank, newImage: Tank) => {
  const event = {
    tank_id: newImage.id,
    timestamp: undefined,
    type: eventType,
    update: undefined,
    comments: undefined
  } as Event;

  const createAilmentEventObject = (diffArray: Ailment[]): AilmentEvent[] => {
    const update: AilmentEvent[] = [];
      for (const ailment of diffArray) {
        update.push({
          name: ailment.name,
          type: ailment.type,
          comments: ailment.comments
        } as AilmentEvent);
      }
    return update;
  }
  const createParameterEventObject = (diffArray: Parameter[]): ParameterEvent[] => {
    const update: ParameterEvent[] = [];
    for (const parameter of diffArray) {
      update.push({
        parameter: parameter.parameter,
        result: parameter.result,
        result_unit: parameter.result_unit
      } as ParameterEvent);
    }
    return update;
  }

  /* Simple events:
   * Product / Algicide / Medication / Bacteria / Biofilm added
   * Livestock fed
   * Water Column / Substrate fertilized
   * Water Change
   * Cycle Started / Complete / Crashed
   * Temperature / Light Settings changed
   */

  // Handle complex events, determine which array item(s) have changed & add the updated items to event.update
  // Each case has an expected difference in array size (equal or newImage longer, newImage longer, oldImage longer)
  /* Complex events:
   * Parameter tested
   * Test Schedule changed
   * Ailment Dx / Cured
   * Livestock Added / Removed / Died
   * Plant Added / Removed / Died
   */

  // Some complex events have timestamps within them
  // All updates made within a complex event are expected to have the same timestamp (multi changes made at the same time)
  /* Complex events w/ timestamps:
   * Parameter tested
   * Ailment Dx
   */
  switch (eventType) {
    case EVENT.PRODUCT_ADDED:
    case EVENT.ALGICIDE_ADDED:
    case EVENT.BACTERIA_ADDED:
    case EVENT.BIOFILM_ADDED:
    case EVENT.LIVESTOCK_FED:
    case EVENT.MEDICATION_ADDED:
      event.update = {
        name: newImage.recent_product.name,
        dose: newImage.recent_product.dose,
        unit: newImage.recent_product.unit
      } as RecentProductEvent;
      event.timestamp = newImage.recent_product.timestamp;
      break;
    case EVENT.SUBSTRATE_FERTILIZED:
      event.update = {
        name: newImage.recent_substrate_fertilizer.name,
        dose: newImage.recent_substrate_fertilizer.dose,
        unit: newImage.recent_substrate_fertilizer.unit
      } as RecentProductEvent;
      event.timestamp = newImage.recent_substrate_fertilizer.timestamp;
      break;
    case EVENT.WATER_COLUMN_FERTILIZED:
      event.update = {
        name: newImage.recent_water_fertilizer.name,
        dose: newImage.recent_water_fertilizer.dose,
        unit: newImage.recent_water_fertilizer.unit
      } as RecentProductEvent;
      event.timestamp = newImage.recent_water_fertilizer.timestamp;
      break;
    case EVENT.WATER_CHANGE:
      event.update = {
        percentage: newImage.recent_water_change.percentage,
        water_type: newImage.recent_water_change.water_type
      } as WaterChangeEvent;
      event.timestamp = newImage.recent_water_change.timestamp;
      break;
    case EVENT.CYCLE_STARTED:
    case EVENT.CYCLE_COMPLETE:
    case EVENT.CYCLE_CRASHED:
      // Cycle events merely log their type, no other information is needed
      event.update = '';
      event.timestamp = String(Date.now());
      break;
    case EVENT.TEMPERATURE_SETTING_CHANGED:
      event.update = newImage.temperature_setting;
      event.timestamp = String(Date.now());
      break;
    case EVENT.LIGHT_SETTINGS_CHANGED:
      event.update = newImage.light_settings;
      event.timestamp = String(Date.now());
      break;
    case EVENT.PARAMETER_TESTED:
      // oldImage & newImage arrays are expected equal length, or expect newImage array is longer
      const param_oldArray = oldImage.parameters.sort(sortParametersArrayByParameter);
      const param_newArray = newImage.parameters.sort(sortParametersArrayByParameter);
      const param_diffArray: Parameter[] = param_oldArray.length === param_newArray.length ? getArrayOfObjectsDifference(param_oldArray, param_newArray) : getParameterDifference(param_oldArray, param_newArray);

      event.update = createParameterEventObject(param_diffArray);
      event.timestamp = param_diffArray[0].timestamp;
      break;
    case EVENT.TEST_SCHEDULE_CHANGED:
      // oldImage & newImage arrays are expected equal length, or expect newImage array is longer
      const test_oldArray = oldImage.test_schedule.sort(sortTestScheduleArrayByParameter);
      const test_newArray = newImage.test_schedule.sort(sortTestScheduleArrayByParameter);
      const test_diffArray: TestSchedule[] = test_oldArray.length === test_newArray.length ? getArrayOfObjectsDifference(test_oldArray, test_newArray) : getTestScheduleDifference(test_oldArray, test_newArray);

      event.update = test_diffArray;
      event.timestamp = String(Date.now());
      break;
    case EVENT.AILMENT_DX:
      const ailmentDx_diffArray: Ailment[] = getAilmentsDifference(oldImage.ailments, newImage.ailments);
      event.update = createAilmentEventObject(ailmentDx_diffArray);
      event.timestamp = ailmentDx_diffArray[0].timestamp;
      break;
    case EVENT.AILMENT_CURED:
      const diffArray: Ailment[] = getAilmentsDifference(newImage.ailments, oldImage.ailments);
      event.update = createAilmentEventObject(diffArray);
      event.timestamp = String(Date.now());
      break;
    case EVENT.LIVESTOCK_ADDED:
      event.update = getTankInhabitantsDifference(oldImage.livestock, newImage.livestock);
      event.timestamp = String(Date.now());
      break;
    case EVENT.LIVESTOCK_REMOVED:
    case EVENT.LIVESTOCK_DIED:
      event.update = getTankInhabitantsDifference(newImage.livestock, oldImage.livestock);
      event.timestamp = String(Date.now());
      break;
    case EVENT.PLANT_ADDED:
      event.update = getTankInhabitantsDifference(oldImage.plants, newImage.plants);
      event.timestamp = String(Date.now());
      break;
    case EVENT.PLANT_REMOVED:
    case EVENT.PLANT_DIED:
      event.update = getTankInhabitantsDifference(newImage.plants, newImage.plants);
      event.timestamp = String(Date.now());
      break;
  }
  if (!event.timestamp) {
    return;
  }

  const eventExists = await checkEventExists(newImage.id, event.timestamp);
  if (eventExists === undefined) {
    return undefined;
  }
  if (eventExists) {
    console.error(`event already exists for tank id ${newImage.id} at timestamp ${event.timestamp}`);
    return undefined;
  }
  return event;
}

const checkEventExists = async (tank_id: string, timestamp: string): Promise<boolean | undefined> => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  const command = new GetCommand({
    "TableName": TABLE.TANK_EVENT,
    "Key": {
      "tank_id": tank_id,
      "timestamp": timestamp
    }
  });

  try {
    const response = await docClient.send(command);

    if (!response.Item) {
      return false;
    }
    return true;
  } catch (e) {
    console.error(`failed to check for existing event for tank with id ${tank_id} at timestamp ${timestamp}: ${e}`);
    return undefined;
  }
}

const createEventDBEntry = async (event: Event): Promise<PutTankEventResponse> => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  const command = new PutCommand({
    "TableName": TABLE.TANK_EVENT,
    "Item": event
  });

  try {
    const response = await docClient.send(command);

    return {
      data: response,
      message: RESPONSE_MESSAGE.NO_ERROR
    };
  } catch (e) {
    console.error(`failed to create event for tank id ${event.tank_id} at timestamp ${event.timestamp}: ${e}`);
    return {
      data: undefined,
      message: RESPONSE_MESSAGE.INTERNAL
    };
  }
}

const getProductTypeByName = async (productName: string): Promise<GetProductTypeResponse> => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  const command = new GetCommand({
    "TableName": TABLE.PRODUCT,
    "Key": {
      "name": productName
    }
  });

  try {
    const response = await docClient.send(command);

    if (!response.Item) {
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.NOT_FOUND
      };
    }

    const product = response.Item as Product;

    return {
      data: product.type,
      message: RESPONSE_MESSAGE.NO_ERROR
    };
  } catch (e) {
    console.error(`failed to get product with name ${productName}: ${e}`);

    return {
      data: undefined,
      message: RESPONSE_MESSAGE.INTERNAL
    };
  }
}