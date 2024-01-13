import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, PutCommandOutput, UpdateCommand, UpdateCommandOutput, DeleteCommand, DeleteCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { TABLE } from '../constants/table';
import { RESPONSE_MESSAGE } from '../constants/responseMessageEnum';
import { PlantGenus, PlantSpecies } from '../interfaces/plantInterface';
import { spec } from 'node:test/reporters';

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

  async getPlantGenusByGenus(plant_genus: string): Promise<GetPlantResponse> {
    const command = new GetCommand({
      "TableName": TABLE.PLANT,
      "Key": {
        "genus": plant_genus,
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
      console.error(`failed to get plant genus ${plant_genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }
  // Create genus ( cannot change species from it being genus )
  async createPlantGenus() {
  }
  // Update genus ( cannot change species from it being genus )
  async updatePlantGenus() {
  }
  // Delete genus ( disallow deletion if there are species in the genus )
  async deletePlantGenus() {
  }

  async checkGenusExists(plant_genus: string): Promise<boolean> {
    const response = await this.getPlantGenusByGenus(plant_genus);
    const exists = response.message === RESPONSE_MESSAGE.NO_ERROR ? true : false;
    return exists;
  }


  // Get all species within a genus
  async getAllPlantSpeciesInGenus(plant_genus: string) {
    const command = new QueryCommand({
      "TableName": TABLE.PLANT,
      "KeyConditionExpression":
        "genus = :genus",
      "ExpressionAttributeValues": {
        ":genus": { "S": plant_genus }
      }
    });
  }
  // Get species by genus & species
  async getPlantSpeciesByGenusSpecies(plant_genus: string, plant_species: string): Promise<GetPlantResponse> {
    const command = new GetCommand({
      "TableName": TABLE.PLANT,
      "Key": {
        "genus": plant_genus,
        "species": plant_species
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
      console.error(`failed to get plant species ${plant_species} in genus ${plant_genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }
  // Create species ( require existing genus )
  async createPlantSpecies() {
  }
  // Update species ( require existing genus )
  async updatePlantSpecies() {
  }

  async deletePlantSpecies(plant_genus: string, plant_species: string) {
    const command = new DeleteCommand({
      "TableName": TABLE.PLANT,
      "Key": {
        "genus": plant_genus,
        "species": plant_species
      }
    });

    try {
      const response = await this.docClient.send(command);

      return {
        data: response,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to delete plant species ${plant_species} in genus ${plant_genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  /**
   * Considers both the genus and species
   * Checks genus existence first, check species existence only if genus exists as well
   *
   * @returns Whether or not both a given plant genus and species exist within the table
   */
  async checkSpeciesExists(plant_genus: string, plant_species: string) {
    const genusExists = await this.checkGenusExists(plant_genus);
    if (!genusExists) {
      return genusExists;
    }

    const response = await this.getPlantSpeciesByGenusSpecies(plant_genus, plant_species);
    const speciesExists = response.message === RESPONSE_MESSAGE.NO_ERROR ? true : false;
    return speciesExists;
  }

  constructor() {
    this.client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }
}

export default PlantService;