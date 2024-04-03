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

  // Create event needs to check the tank's livestock & plants for sensitivities
  // If a sensitivity to a product is found, the user should be warned prior to the event's creation
  async createEvent(event: Event): Promise<PutEventResponse> {
    const command = new PutCommand({
      "TableName": TABLE.TANK_EVENT,
      "Item": event
    });

    try {
      const response = await this.docClient.send(command);

      return {
        data: response,
        message: RESPONSE_MESSAGE.NO_ERROR
      }
    } catch (e) {
      console.error(`failed to create tank event: ${e}`);

      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      }
    }
  }

  constructor() {
    this.client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }
}

export default EventService;