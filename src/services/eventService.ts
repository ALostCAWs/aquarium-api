import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, PutCommandOutput, UpdateCommand, UpdateCommandOutput, DeleteCommand, DeleteCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { Event } from '../interfaces/eventInterface';
import { Tank } from '../interfaces/tankInterface';
import { TABLE } from '../constants/tableEnum';
import { EVENT } from '../constants/eventEnum';
import { RESPONSE_MESSAGE } from '../constants/responseMessageEnum';

interface GetEventResponse {
  data: Event | Event[] | undefined,
  message: string
}
interface PutEventResponse {
  data: PutCommandOutput | undefined,
  message: string
}
interface UpdateEventResponse {
  data: UpdateCommandOutput | undefined,
  message: string
}

interface DeleteEventResponse {
  data: DeleteCommandOutput | undefined,
  message: string
}

class EventService {
  client: DynamoDBClient;
  docClient: DynamoDBDocumentClient;

  async determineEventOccurred(tank: Tank, tankPreviousState: Tank) {
    if (tank.is_cycled !== tankPreviousState.is_cycled) {
      const cycleEvent = this.determineCycleEvent(tankPreviousState.is_cycled);
      // create event for cycle change
    }

    if (tank.recent_water_change_timestamp !== tankPreviousState.recent_water_change_timestamp) {
      // create event for water change
    }

    if (tank.livestock_list.length !== tankPreviousState.livestock_list.length) {
      // will need an update for determining deaths vs. removals
      // for now, program will consider all removals to be a death
      const livestockEvent = this.determineLivestockListEvent(tank.livestock_list.length, tankPreviousState.livestock_list.length);
      // create event for list update
    }

    if (tank.plant_list.length !== tankPreviousState.plant_list.length) {
      // will need an update for determining deaths vs. removals
      // for now, program will consider all removals to be a death
      const livestockEvent = this.determinePlantListEvent(tank.plant_list.length, tankPreviousState.plant_list.length);
      // create event for list update
    }
  }

  determineCycleEvent(previousCycleState: boolean): string {
    let cycleEvent: string = previousCycleState ? EVENT.CYCLE_CRASHED : EVENT.CYCLE_COMPLETE;
    return cycleEvent;
  }

  determineLivestockListEvent(tankListLength: number, previousListLength: number): string {
    let livestockEvent: string = tankListLength > previousListLength ? EVENT.LIVESTOCK_ADDED : EVENT.LIVESTOCK_DIED;
    return livestockEvent;
  }

  determinePlantListEvent(tankListLength: number, previousListLength: number): string {
    let plantEvent: string = tankListLength > previousListLength ? EVENT.LIVESTOCK_ADDED : EVENT.LIVESTOCK_DIED;
    return plantEvent;
  }

  async createEvent() {

  }

  constructor() {
    this.client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }
}

export default EventService;