import { Tank } from "../interfaces/tankInterface";
import { EVENT } from "../constants/eventEnum";
import { LightSettings } from "../interfaces/lightInterface";
import { Parameter } from "../interfaces/parameterInterface";
import { sortAilmentArrayByName, sortParametersArrayByParameter, sortTestScheduleArrayByParameter } from "./sortData";
import { checkObjectImagesEqual, checkArrayOfObjectImagesEqual } from "./checkObjectEquality";
import { TestSchedule } from "../interfaces/testScheduleInterface";
import { Ailment } from "../interfaces/ailmentInterface";
import ProductService from "../services/productsService";
import { Product } from "../interfaces/productInterface";
import { PRODUCT_TYPE } from "../constants/productEnum";

export const determineEventType = async (oldImage: Tank, newImage: Tank): Promise<string> => {
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
    const productService = new ProductService();
    const product = (await productService.getProductByName(newImage.recent_product.name)).data as Product;

    if (!product) {
      // TODO: Handle product not in db
      // Cancel change?
    }

    switch (product.type) {
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