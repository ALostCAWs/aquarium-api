import { Router } from 'express';
import PlantService from '../services/plantService';
import { PlantGenus, PlantSpecies } from '../interfaces/plantInterface';
import { RESPONSE_MESSAGE } from '../constants/responseMessageEnum';
import { PLANT_DIFFICULTY, PLANT_LIGHT } from '../constants/plantEnum';
import { checkValidSpeciesToCreate } from '../functions/validatePlant';

export const PlantRouter = Router();
const plantService = new PlantService();

PlantRouter.get('/:genus', async (req, res) => {
  const plant_genus = req.params['genus'];

  const response = await plantService.getPlantGenusByGenus(plant_genus);

  switch (response.message) {
    case RESPONSE_MESSAGE.NO_ERROR:
      res.status(200).send(response.data);
      break;
    case RESPONSE_MESSAGE.NOT_FOUND:
      res.status(404).send(RESPONSE_MESSAGE.NOT_FOUND);
      break;
    case RESPONSE_MESSAGE.INTERNAL:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
    default:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
  }
});

PlantRouter.get('/:genus/:species', async (req, res) => {
  const plant_genus = req.params['genus'];
  const plant_species = req.params['species'];

  const response = await plantService.getPlantSpeciesByGenusSpecies(plant_genus, plant_species);

  switch (response.message) {
    case RESPONSE_MESSAGE.NO_ERROR:
      res.status(200).send(response.data);
      break;
    case RESPONSE_MESSAGE.NOT_FOUND:
      res.status(404).send(RESPONSE_MESSAGE.NOT_FOUND);
      break;
    case RESPONSE_MESSAGE.INTERNAL:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
    default:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
  }
});

// TODO:
// Make it required for difficulty / light / feed type / etc ( attrs w/ enums ) to only be the values specified in those enums
PlantRouter.post('/', async (req, res) => {
  const genus: string = req.body.genus || '';
  const species: string = req.body.species || '';
  const CO2: boolean = req.body.CO2 || false;
  const difficulty: string = req.body.difficulty || PLANT_DIFFICULTY.UNSPECIFIED;
  const commonName: string = req.body.commonName || '';
  const light: string = req.body.light || PLANT_LIGHT.UNSPECIFIED;

  const plantSpecies: PlantSpecies = {
    genus: genus,
    species: species,
    CO2: CO2,
    difficulty: difficulty,
    commonName: commonName,
    light: light
  }

  const requestValidity = await checkValidSpeciesToCreate(plantSpecies);

  if (!requestValidity.valid) {
    let statusCode: number;
    switch (requestValidity.message) {
      case RESPONSE_MESSAGE.NOT_FOUND:
        statusCode = 404;
        break;
      case RESPONSE_MESSAGE.ALREADY_EXISTS:
      case RESPONSE_MESSAGE.INVALID:
        statusCode = 400;
        break;
      default:
        statusCode = 400;
    }

    res.status(statusCode).send(requestValidity.message);
  }

  if (requestValidity.valid) {
    const response = await plantService.createPlantSpecies(plantSpecies);

    switch (response.message) {
      case RESPONSE_MESSAGE.NO_ERROR:
        res.status(200).send(response.data);
        break;
      case RESPONSE_MESSAGE.INTERNAL:
        res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
        break;
      default:
        res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
        break;
    }
  }
});

PlantRouter.delete('/:genus/:species', async (req, res) => {
  const plant_genus = req.params['genus'];
  const plant_species = req.params['species'];

  const exists = await plantService.checkSpeciesExists(plant_genus, plant_species);
  if (!exists) {
    res.status(404).send(RESPONSE_MESSAGE.NOT_FOUND);
  }

  if (exists) {
    const response = await plantService.deletePlantSpecies(plant_genus, plant_species);

    switch (response.message) {
      case RESPONSE_MESSAGE.NO_ERROR:
        res.status(204).send();
        break;
      case RESPONSE_MESSAGE.INTERNAL:
        res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
        break;
      default:
        res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
        break;
    }
  }
});