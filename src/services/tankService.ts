import { ScanCommand } from '@aws-sdk/lib-dynamodb';
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
      const data = await this.docClient.send(command);

      if (data.Items?.length === 0) {
        return {
          data: undefined,
          error: RESPONSE_MESSAGE.NO_ITEMS_FOUND
        };
      }

      let tanks = data.Items as Tank[];

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
}

export default TankService;