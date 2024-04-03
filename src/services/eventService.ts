import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, PutCommandOutput, UpdateCommand, UpdateCommandOutput, DeleteCommand, DeleteCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Event } from '../interfaces/eventInterface';
import { TABLE } from '../constants/tableEnum';
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

  async getAllEvents(): Promise<GetEventResponse> {
    const command = new ScanCommand({
      "TableName": TABLE.TANK_EVENT
    });

    try {
      const response = await this.docClient.send(command);

      if (response.Items?.length === 0) {
        return {
          data: undefined,
          message: RESPONSE_MESSAGE.NO_ITEMS_FOUND
        };
      }

      const events = response.Items as Event[];

      return {
        data: events,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to get tank events: ${e}`);

      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async getAllEventsByTank(tank_id: string): Promise<GetEventResponse> {
    return {
      data: undefined,
      message: RESPONSE_MESSAGE.INTERNAL
    };
  }

  async getEventByTankTimestamp(tank_id: string, timestamp: string): Promise<GetEventResponse> {
    return {
      data: undefined,
      message: RESPONSE_MESSAGE.INTERNAL
    };
  }

  async getAllEventsByTankDateRange(tank_id: string, timestamp_searchStart: string, timestamp_searchEnd: string): Promise<GetEventResponse> {
    return {
      data: undefined,
      message: RESPONSE_MESSAGE.INTERNAL
    };
  }

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

  async putEvent(event: Event): Promise<PutEventResponse> {
    const command = new PutCommand({
      "TableName": TABLE.TANK_EVENT,
      "Item": event
    });

    try {
      const response = await this.docClient.send(command);

      if (!this.checkEventExists(event.tank_id, event.timestamp)) {
        response.$metadata.httpStatusCode = 201;
        return {
          data: response,
          message: RESPONSE_MESSAGE.NOT_FOUND
        };
      }

      return {
        data: response,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to update tank event - tank: ${event.tank_id} timestamp: ${event.timestamp}: ${e}`);

      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async deleteEvent(tank_id: string, timestamp: string) {
    const command = new DeleteCommand({
      "TableName": TABLE.TANK_EVENT,
      "Key": {
        "tank_id": tank_id,
        "timestamp": timestamp
      }
    });

    try {
      const response = await this.docClient.send(command);

      return {
        data: response,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to delete tank event - tank: ${tank_id} timestamp: ${timestamp}: ${e}`);

      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async checkEventExists(tank_id: string, timestamp: string): Promise<boolean> {
    const response = await this.getEventByTankTimestamp(tank_id, timestamp);
    const eventExists = response.message === RESPONSE_MESSAGE.NO_ERROR ? true : false;
    return eventExists;
  }

  async deleteAllEvents() {
    const events = (await this.getAllEvents()).data as Event[];

    for (const [i, event] of events.entries()) {
      await this.deleteEvent(event.tank_id, event.timestamp);
    }
  }

  constructor() {
    this.client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }
}

export default EventService;