import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, PutCommandOutput, UpdateCommand, UpdateCommandOutput, DeleteCommand, DeleteCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { TABLE } from '../constants/table';
import { RESPONSE_MESSAGE } from '../constants/responseMessage';
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
    const command = new ScanCommand({
      "TableName": TABLE.PLANT
    });

    try {
      const response = await this.docClient.send(command);

      if (response.Items?.length === 0) {
        return {
          data: undefined,
          message: RESPONSE_MESSAGE.NO_ITEMS_FOUND
        };
      }


    } catch (e) {
      console.error(`failed to get plants: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }
  // Get genus by genus
  async getPlantGenusByGenus() {
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
  // Get all species within a genus
  async getAllPlantSpeciesInGenus() {
  }
  // Get species by genus & species
  async getPlantSpeciesByGenusSpecies() {
  }
  // Create species ( require existing genus )
  async createPlantSpecies() {
  }
  // Update species ( require existing genus )
  async updatePlantSpecies() {
  }

  async deletePlantSpecies() {
  }

  constructor() {
    this.client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }
}

export default PlantService;