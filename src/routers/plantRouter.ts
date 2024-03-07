import { Router } from 'express';
import PlantService from '../services/plantService';
import { PlantGenus, PlantSpecies } from '../interfaces/plantInterface';
import { Temperature_Range, Parameter_Range } from '../interfaces/rangeInterface';
import { RESPONSE_MESSAGE } from '../constants/responseMessageEnum';
import { PLANT_TYPE, PLANT_FEED_STYLE, PLANT_GROWTH_RATE, PLANT_DIFFICULTY, PLANT_LIGHT } from '../constants/plantEnum';
import { checkValidPlantGenusToCreate, checkValidPlantGenusToDelete, checkValidPlantGenusToUse, checkValidPlantSpeciesToCreate } from '../functions/validatePlant';

export const PlantRouter = Router();
const plantService = new PlantService();

PlantRouter.get('/:genus', async (req, res) => {
  const genus = req.params['genus'];

  const response = await plantService.getPlantGenusByGenus(genus);

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

PlantRouter.get('/:genus/species', async (req, res) => {
  const genus = req.params['genus'];

  const response = await plantService.getAllPlantSpeciesInGenus(genus);

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
PlantRouter.post('/genus', async (req, res) => {
  const genus: string = req.body.genus || '';
  const type: string = req.body.type || PLANT_TYPE.UNSPECIFIED;
  const feed_style: string = req.body.feed_style || PLANT_FEED_STYLE.UNSPECIFIED;
  const growth_rate: string = req.body.growth_rate || PLANT_GROWTH_RATE.UNSPECIFIED;
  const temperature_range: Temperature_Range = req.body.temperature_range || {};
  const parameters: Parameter_Range = req.body.parameters || {};
  const sensitivity: string[] = req.body.sensitivity || [];

  const plantGenus: PlantGenus = {
    genus: genus,
    species: 'genus',
    type: type,
    feed_style: feed_style,
    growth_rate: growth_rate,
    temperature_range: temperature_range,
    parameters: parameters,
    sensitivity: sensitivity
  }

  const requestValidity = await checkValidPlantGenusToCreate(plantGenus);

  if (!requestValidity.valid) {
    res.status(400).send(requestValidity.message);
  }

  if (requestValidity.valid) {
    const response = await plantService.createPlantGenus(plantGenus);

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

PlantRouter.put('/genus', async (req, res) => {
  const genus: string = req.body.genus || '';
  const type: string = req.body.type || '';
  const feed_style: string = req.body.feed_style || PLANT_FEED_STYLE.UNSPECIFIED;
  const growth_rate: string = req.body.growth_rate || PLANT_GROWTH_RATE.UNSPECIFIED;
  const temperature_range: Temperature_Range = req.body.temperature_range || {};
  const parameters: Parameter_Range = req.body.parameters || {};
  const sensitivity: string[] = req.body.sensitivity || [];

  const plantGenus: PlantGenus = {
    genus: genus,
    species: 'genus',
    type: type,
    feed_style: feed_style,
    growth_rate: growth_rate,
    temperature_range: temperature_range,
    parameters: parameters,
    sensitivity: sensitivity
  }

  const response = await plantService.putPlantGenus(plantGenus);

  switch (response.message) {
    case RESPONSE_MESSAGE.NO_ERROR:
      res.status(200).send(response.data);
      break;
    case RESPONSE_MESSAGE.NOT_FOUND:
      res.status(201).send(response.data);
      break;
    case RESPONSE_MESSAGE.INTERNAL:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
    default:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
  }
});

PlantRouter.delete('/:genus', async (req, res) => {
  const genus = req.params['genus'];

  const requestValidity = await checkValidPlantGenusToDelete(genus);

  if (!requestValidity.valid) {
    switch (requestValidity.message) {
      case RESPONSE_MESSAGE.INVALID:
        res.status(400).send(RESPONSE_MESSAGE.INVALID);
        break;
      case RESPONSE_MESSAGE.NOT_FOUND:
        res.status(404).send(RESPONSE_MESSAGE.NOT_FOUND);
        break;
      case RESPONSE_MESSAGE.HAS_SPECIES:
        res.status(409).send(RESPONSE_MESSAGE.HAS_SPECIES);
        break;
    }
  }

  if (requestValidity.valid) {
    const response = await plantService.deletePlantGenus(genus);

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


PlantRouter.get('/:genus/:species', async (req, res) => {
  const genus = req.params['genus'];
  const species = req.params['species'];

  const response = await plantService.getPlantSpeciesByGenusSpecies(genus, species);

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
PlantRouter.post('/species', async (req, res) => {
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
    common_name: commonName,
    light: light
  }

  const requestValidity = await checkValidPlantSpeciesToCreate(plantSpecies);

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

PlantRouter.put('/species', async (req, res) => {
  const genus: string = req.body.genus || '';
  const species: string = req.body.species || '';
  const commonName: string = req.body.commonName || '';
  const CO2: boolean = req.body.CO2 || false;
  const difficulty: string = req.body.difficulty || PLANT_DIFFICULTY.UNSPECIFIED;
  const light: string = req.body.light || PLANT_LIGHT.UNSPECIFIED;

  const requestValidity = await checkValidPlantGenusToUse(genus);

  if (!requestValidity.valid) {
    switch (requestValidity.message) {
      case RESPONSE_MESSAGE.INVALID:
        res.status(400).send(RESPONSE_MESSAGE.INVALID);
        break;
      case RESPONSE_MESSAGE.NOT_FOUND:
        res.status(404).send(RESPONSE_MESSAGE.NOT_FOUND);
        break;
    }
  }

  if (requestValidity.valid) {
    const plantSpecies: PlantSpecies = {
      genus: genus,
      species: species,
      common_name: commonName,
      CO2: CO2,
      difficulty: difficulty,
      light: light
    }

    const response = await plantService.putPlantSpecies(plantSpecies);

    switch (response.message) {
      case RESPONSE_MESSAGE.NO_ERROR:
        res.status(200).send(response.data);
        break;
      case RESPONSE_MESSAGE.NOT_FOUND:
        res.status(201).send(response.data);
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
  const genus = req.params['genus'];
  const species = req.params['species'];

  const response = await plantService.deletePlantSpecies(genus, species);

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
});