import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, PutCommandOutput, UpdateCommand, UpdateCommandOutput, DeleteCommand, DeleteCommandOutput, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { TABLE } from '../constants/tableEnum';
import { RESPONSE_MESSAGE } from '../constants/responseMessageEnum';
import { PlantGenus, PlantSpecies } from '../interfaces/plantInterface';

interface GetPlantResponse {
  data: PlantGenus | PlantSpecies | PlantGenus[] | PlantSpecies[] | undefined;
  message: string;
}

interface GetSensitivityResponse {
  data: string[] | undefined,
  message: string
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

  async getAllPlantGenera() {
    const command = new QueryCommand({
      "TableName": TABLE.PLANT,
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

      let genera = response.Items as PlantGenus[];
      return {
        data: genera,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to get plant genera: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      }
    }
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

  async getPlantGenusSensitivity(genus: string): Promise<GetSensitivityResponse> {
    const command = new GetCommand({
      "TableName": TABLE.PLANT,
      "Key": {
        "genus": genus,
        "species": "genus"
      },
      "ProjectionExpression": "sensitivity"
    });

    try {
      const response = await this.docClient.send(command);

      // Finding no sensitivities in a given genus isn't necessarily erroneous
      if (!response.Item) {
        return {
          data: [],
          message: RESPONSE_MESSAGE.NO_ERROR
        };
      }

      const sensitivity = response.Item as string[];

      return {
        data: sensitivity,
        message: RESPONSE_MESSAGE.NO_ERROR
      };
    } catch (e) {
      console.error(`failed to get sensitivities for plant genus ${genus}: ${e}`);
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

  async createPlantGenus(plantGenus: PlantGenus): Promise<PutPlantResponse> {
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

  async putPlantGenus(plantGenus: PlantGenus): Promise<PutPlantResponse> {
    const command = new PutCommand({
      "TableName": TABLE.PLANT,
      "Item": plantGenus
    });

    try {
      const exists = await this.checkGenusExists(plantGenus.genus);
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
      console.error(`failed to update plant genus ${plantGenus.genus}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

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
      console.error(`failed to delete plant genus ${genus}: ${e}`);
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

  async putPlantSpecies(plantSpecies: PlantSpecies): Promise<PutPlantResponse> {
    const command = new PutCommand({
      "TableName": TABLE.PLANT,
      "Item": plantSpecies
    });

    try {
      const response = await this.docClient.send(command);

      if (!this.checkSpeciesExists(plantSpecies.genus, plantSpecies.species)) {
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
      console.error(`failed to update plant species ${plantSpecies.genus} ${plantSpecies.species}: ${e}`);
      return {
        data: undefined,
        message: RESPONSE_MESSAGE.INTERNAL
      };
    }
  }

  async deletePlantSpecies(genus: string, species: string): Promise<DeletePlantResponse> {
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

  async deleteAllPLantEntries() {
    const generaEntries = (await this.getAllPlantGenera()).data as PlantGenus[];

    for (const [i, genusEntry] of generaEntries.entries()) {
      const genus = genusEntry.genus;
      const speciesInGenus = (await this.getAllPlantSpeciesInGenus(genus)).data as PlantSpecies[];

      for (const [i, speciesEntry] of speciesInGenus.entries()) {
        const species = speciesEntry.species;
        await this.deletePlantSpecies(genus, species);
      }
      await this.deletePlantGenus(genus);
    }
  }

  constructor() {
    this.client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }
}

export default PlantService;