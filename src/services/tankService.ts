import { ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { Tank } from '../interfaces/tankInterface';
import { TABLE } from '../constants/table';
import { RESPONSE_MESSAGE } from '../constants/responseMessage';
import Service from './service';

interface TankResponse {
  data: Tank | Tank[] | undefined,
  error: string
}

class TankService extends Service {
  async getAllTanks(): Promise<TankResponse> {
    const command = new ScanCommand({
      "TableName": TABLE.TANK
    });

    try {
      const response = await this.docClient.send(command);

      if (response.Items?.length === 0) {
        return {
          data: undefined,
          error: RESPONSE_MESSAGE.NO_ITEMS_FOUND
        };
      }

      const tanks = response.Items as Tank[];

      return {
        data: tanks,
        error: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to get tanks: ${e}`);
      return {
        data: undefined,
        error: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async getTankById(tank_id: string): Promise<TankResponse> {
    const command = new GetCommand({
      "TableName": TABLE.TANK,
      "Key": {
        "id": tank_id
      }
    });

    try {
      const response = await this.docClient.send(command);

      if (!response.Item) {
        return {
          data: undefined,
          error: RESPONSE_MESSAGE.NOT_FOUND
        };
      }

      const tank = response.Item as Tank;

      return {
        data: tank,
        error: RESPONSE_MESSAGE.NO_ERROR
      }
    } catch (e) {
      console.error(`failed to get tank with Id ${tank_id}`);
      return {
        data: undefined,
        error: RESPONSE_MESSAGE.INTERNAL
      }
    }
  }
}

export default TankService;