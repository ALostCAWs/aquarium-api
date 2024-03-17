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

  // Going to use Lambda triggers for these
  async determineEventOccurred(tank: Tank, tankPreviousState: Tank) {
    if (tank.is_cycled !== tankPreviousState.is_cycled) {
      const cycleEvent = this.determineCycleEvent(tankPreviousState.is_cycled);
      // create event for cycle change
    }

    if (tank.recent_water_change.timestamp !== tankPreviousState.recent_water_change.timestamp) {
      // create event for water change
    }

    if (tank.livestock.length !== tankPreviousState.livestock.length) {
      // will need an update for determining deaths vs. removals
      // for now, program will consider all removals to be a death
      const livestockEvent = this.determineLivestockListEvent(tank.livestock.length, tankPreviousState.livestock.length);
      // create event for list update
    }

    if (tank.plants.length !== tankPreviousState.plants.length) {
      // will need an update for determining deaths vs. removals
      // for now, program will consider all removals to be a death
      const livestockEvent = this.determinePlantListEvent(tank.plants.length, tankPreviousState.plants.length);
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

  // Create event needs to check the tank's livestock & plants for sensitivities
  // If a sensitivity to a product is found, the user should be warned prior to the event's creation
  async createEvent() {

  }

  constructor() {
    this.client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }
}

export default EventService;