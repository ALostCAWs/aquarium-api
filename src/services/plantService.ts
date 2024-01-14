import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, PutCommandOutput, UpdateCommand, UpdateCommandOutput, DeleteCommand, DeleteCommandOutput, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { TABLE } from '../constants/table';
import { RESPONSE_MESSAGE } from '../constants/responseMessageEnum';
import { PlantGenus, PlantSpecies } from '../interfaces/plantInterface';

interface GetPlantResponse {
  data: PlantGenus | PlantSpecies | PlantGenus[] | PlantSpecies[] | undefined;
  message: string;
}

interface PutPlantResponse {
  data: PutCommandOutput | undefined,
  message: string
}

interface DeletePlantResponse {
  data: DeleteCommandOutput | undefined,
  message: string
}

class PlantService {
  client: DynamoDBClient;
  docClient: DynamoDBDocumentClient;

  // Get all genera
  async getAllPlantGenera() {
  }

  async getPlantGenusByGenus(genus: string): Promise<GetPlantResponse> {
    const command = new GetCommand({
      "TableName": TABLE.PLANT,
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

      const plantGenus = response.Item as PlantGenus;

      return {
        data: plantGenus,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to get plant genus ${genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async getAllPlantSpeciesInGenus(genus: string): Promise<GetPlantResponse> {
    const command = new QueryCommand({
      "TableName": TABLE.PLANT,
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

      let species = response.Items as PlantSpecies[];
      species = species.filter((s) => { return s.species !== 'genus' });

      return {
        data: species,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to get plant species list in genus ${genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.NO_ITEMS_FOUND
      };
    }
  }

  // Create genus ( cannot change species from it being genus )
  async createPlantGenus(plantGenus: PlantGenus) {
    const command = new PutCommand({
      "TableName": TABLE.PLANT,
      "Item": plantGenus
    });

    try {
      const response = await this.docClient.send(command);
      return {
        data: response,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to create plant genus ${plantGenus.genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }
  // Update genus ( cannot change species from it being genus )
  async updatePlantGenus() {
  }
  // Delete genus ( disallow deletion if there are species in the genus )
  async deletePlantGenus(genus: string): Promise<DeletePlantResponse> {
    const command = new DeleteCommand({
      "TableName": TABLE.PLANT,
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
      console.error(`failed to delete genus ${genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }


  async getPlantSpeciesByGenusSpecies(genus: string, species: string): Promise<GetPlantResponse> {
    const command = new GetCommand({
      "TableName": TABLE.PLANT,
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

      const plantSpecies = response.Item as PlantSpecies;

      return {
        data: plantSpecies,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to get plant species ${species} in genus ${genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  // Create species ( require existing genus )
  async createPlantSpecies(plantSpecies: PlantSpecies): Promise<PutPlantResponse> {
    const command = new PutCommand({
      "TableName": TABLE.PLANT,
      "Item": plantSpecies
    });

    try {
      const response = await this.docClient.send(command);

      return {
        data: response,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to create plant species ${plantSpecies.species} in genus ${plantSpecies.genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  // Update species ( require existing genus )
  async updatePlantSpecies() {
  }

  async deletePlantSpecies(genus: string, species: string) {
    const command = new DeleteCommand({
      "TableName": TABLE.PLANT,
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
      console.error(`failed to delete plant species ${species} in genus ${genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async checkGenusExists(genus: string): Promise<boolean> {
    const response = await this.getPlantGenusByGenus(genus);
    const exists = response.message === RESPONSE_MESSAGE.NO_ERROR ? true : false;
    return exists;
  }
  async checkGenusHasSpecies(genus: string): Promise<boolean> {
    const response = await this.getAllPlantSpeciesInGenus(genus);

    if (response.data !== undefined) {
      const species = response.data as PlantSpecies[];
      const exists = species.length !== 0 ? true : false;
      return exists;
    }

    return false;
  }
  async checkSpeciesExists(genus: string, species: string) {
    const response = await this.getPlantSpeciesByGenusSpecies(genus, species);
    const speciesExists = response.message === RESPONSE_MESSAGE.NO_ERROR ? true : false;
    return speciesExists;
  }

  constructor() {
    this.client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }
}

export default PlantService;