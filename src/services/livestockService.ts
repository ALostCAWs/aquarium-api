import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, PutCommandOutput, UpdateCommand, UpdateCommandOutput, DeleteCommand, DeleteCommandOutput, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { TABLE } from '../constants/tableEnum';
import { RESPONSE_MESSAGE } from '../constants/responseMessageEnum';
import { LivestockGenus, LivestockSpecies } from '../interfaces/livestockInterface'

interface GetLivestockResponse {
  data: LivestockGenus | LivestockSpecies | LivestockGenus[] | LivestockSpecies[] | undefined;
  message: string;
}

interface PutLivestockResponse {
  data: PutCommandOutput | undefined,
  message: string
}

interface DeleteLivestockResponse {
  data: DeleteCommandOutput | undefined,
  message: string
}

class LivestockService {
  client: DynamoDBClient;
  docClient: DynamoDBDocumentClient;

  async getAllLivestockGenera() {
    const command = new QueryCommand({
      "TableName": TABLE.LIVESTOCK,
      "IndexName": 'species-index',
      "KeyConditionExpression": 'species = :species_name',
      "ExpressionAttributeValues": {
        ':species_name': 'genus'
      }
    });

    try {
      const response = await this.docClient.send(command);

      if (response.Items?.length === 0) {
        return {
          data: [],
          message: RESPONSE_MESSAGE.NOT_FOUND
        };
      }

      let genera = response.Items as LivestockGenus[];
      return {
        data: genera,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to get livestock genera: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      }
    }
  }

  async getLivestockGenusByGenus(genus: string): Promise<GetLivestockResponse> {
    const command = new GetCommand({
      "TableName": TABLE.LIVESTOCK,
      "Key": {
        "genus": genus,
        "species": "genus"
      }
    });

    try {
      const response = await this.docClient.send(command);

      if (!response.Item) {
        return {
          data: undefined,
          message: RESPONSE_MESSAGE.NOT_FOUND
        };
      }

      const LivestockGenus = response.Item as LivestockGenus;

      return {
        data: LivestockGenus,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to get livestock genus ${genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async getAllLivestockSpeciesInGenus(genus: string): Promise<GetLivestockResponse> {
    const command = new QueryCommand({
      "TableName": TABLE.LIVESTOCK,
      "KeyConditionExpression":
        "genus = :genus",
      "ExpressionAttributeValues": {
        ":genus": genus
      }
    });

    try {
      const response = await this.docClient.send(command);

      if (response.Items?.length === 0) {
        return {
          data: [],
          message: RESPONSE_MESSAGE.NO_ERROR
        };
      }

      let species = response.Items as LivestockSpecies[];
      species = species.filter((s) => { return s.species !== 'genus' });

      return {
        data: species,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to get livestock species list in genus ${genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.NO_ITEMS_FOUND
      };
    }
  }

  async createLivestockGenus(LivestockGenus: LivestockGenus): Promise<PutLivestockResponse> {
    const command = new PutCommand({
      "TableName": TABLE.LIVESTOCK,
      "Item": LivestockGenus
    });

    try {
      const response = await this.docClient.send(command);
      console.log(response);
      return {
        data: response,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to create livestock genus ${LivestockGenus.genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async putLivestockGenus(LivestockGenus: LivestockGenus): Promise<PutLivestockResponse> {
    const command = new PutCommand({
      "TableName": TABLE.LIVESTOCK,
      "Item": LivestockGenus
    });

    try {
      const exists = await this.checkGenusExists(LivestockGenus.genus);
      const response = await this.docClient.send(command);

      if (!exists) {
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
      console.error(`failed to update livestock genus ${LivestockGenus.genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async deleteLivestockGenus(genus: string): Promise<DeleteLivestockResponse> {
    const command = new DeleteCommand({
      "TableName": TABLE.LIVESTOCK,
      "Key": {
        "genus": genus,
        "species": 'genus'
      }
    });

    try {
      const response = await this.docClient.send(command);
      return {
        data: response,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to delete livestock genus ${genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }


  async getLivestockSpeciesByGenusSpecies(genus: string, species: string): Promise<GetLivestockResponse> {
    const command = new GetCommand({
      "TableName": TABLE.LIVESTOCK,
      "Key": {
        "genus": genus,
        "species": species
      }
    });

    try {
      const response = await this.docClient.send(command);

      if (!response.Item) {
        return {
          data: undefined,
          message: RESPONSE_MESSAGE.NOT_FOUND
        };
      }

      const LivestockSpecies = response.Item as LivestockSpecies;

      return {
        data: LivestockSpecies,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to get livestock species ${species} in genus ${genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async createLivestockSpecies(LivestockSpecies: LivestockSpecies): Promise<PutLivestockResponse> {
    const command = new PutCommand({
      "TableName": TABLE.LIVESTOCK,
      "Item": LivestockSpecies
    });

    try {
      const response = await this.docClient.send(command);

      return {
        data: response,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to create livestock species ${LivestockSpecies.species} in genus ${LivestockSpecies.genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  // Update species ( require existing genus )
  async putLivestockSpecies(LivestockSpecies: LivestockSpecies): Promise<PutLivestockResponse> {
    const command = new PutCommand({
      "TableName": TABLE.LIVESTOCK,
      "Item": LivestockSpecies
    });

    try {
      const response = await this.docClient.send(command);

      if (!this.checkSpeciesExists(LivestockSpecies.genus, LivestockSpecies.species)) {
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
      console.error(`failed to update livestock species ${LivestockSpecies.genus} ${LivestockSpecies.species}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async deleteLivestockSpecies(genus: string, species: string): Promise<DeleteLivestockResponse> {
    const command = new DeleteCommand({
      "TableName": TABLE.LIVESTOCK,
      "Key": {
        "genus": genus,
        "species": species
      }
    });

    try {
      const response = await this.docClient.send(command);

      return {
        data: response,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to delete livestock species ${species} in genus ${genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async checkGenusExists(genus: string): Promise<boolean> {
    const response = await this.getLivestockGenusByGenus(genus);
    const exists = response.message === RESPONSE_MESSAGE.NO_ERROR ? true : false;
    return exists;
  }
  async checkGenusHasSpecies(genus: string): Promise<boolean> {
    const response = await this.getAllLivestockSpeciesInGenus(genus);

    if (response.data !== undefined) {
      const species = response.data as LivestockSpecies[];
      const exists = species.length !== 0 ? true : false;
      return exists;
    }

    return false;
  }
  async checkSpeciesExists(genus: string, species: string) {
    const response = await this.getLivestockSpeciesByGenusSpecies(genus, species);
    const speciesExists = response.message === RESPONSE_MESSAGE.NO_ERROR ? true : false;
    return speciesExists;
  }

  constructor() {
    this.client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }
}

export default LivestockService;