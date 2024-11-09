import { Router } from 'express';
import LivestockService from '../services/livestockService';
import { LivestockGenus, LivestockSpecies } from '../interfaces/livestockInterface';
import { TemperatureRange, ParameterRange } from '../interfaces/rangeInterface';
import { RESPONSE_MESSAGE } from '../constants/responseMessageEnum';
import { LIVESTOCK_TYPE, LIVESTOCK_FEED_STYLE, REPRODUCTION_STYLE, FISH_REPRODUCTION_STYLE, SHRIMP_REPRODUCTION_STYLE, LIVESTOCK_DIFFICULTY } from '../constants/livestockEnum';
import { checkValidLivestockGenusToCreate, checkValidLivestockGenusToDelete, checkValidLivestockGenusToUse, checkValidLivestockSpeciesToCreate } from '../functions/validation/validateLivestock';

export const LivestockRouter = Router();
const livestockService = new LivestockService();

LivestockRouter.get('/genera', async (req, res) => {
  const response = await livestockService.getAllLivestockGenera();

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

LivestockRouter.get('/:genus', async (req, res) => {
  const genus = req.params['genus'];

  const response = await livestockService.getLivestockGenusByGenus(genus);

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

LivestockRouter.get('/:genus/species', async (req, res) => {
  const genus = req.params['genus'];

  const response = await livestockService.getAllLivestockSpeciesInGenus(genus);

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
// Make it required for difficulty / feed type / etc ( attrs w/ enums ) to only be the values specified in those enums
LivestockRouter.post('/genus', async (req, res) => {
  const genus: string = req.body.genus || '';
  const type: string = req.body.type || LIVESTOCK_TYPE.UNSPECIFIED;
  const feed_style: string = req.body.feed_style || LIVESTOCK_FEED_STYLE.UNSPECIFIED;
  const reproduction_style: string = req.body.reproduction_style || REPRODUCTION_STYLE.UNSPECIFIED;
  const temperature_range: TemperatureRange = req.body.temperature_range || {};
  const parameters: ParameterRange = req.body.parameters || {};
  const sensitivity: string[] = req.body.sensitivity || [];

  const livestockGenus: LivestockGenus = {
    genus: genus,
    species: 'genus',
    type: type,
    feed_style: feed_style,
    reproduction_style: reproduction_style,
    temperature_range: temperature_range,
    parameters: parameters,
    sensitivity: sensitivity
  }

  const requestValidity = await checkValidLivestockGenusToCreate(livestockGenus);

  if (!requestValidity.valid) {
    res.status(400).send(requestValidity.message);
  }

  if (requestValidity.valid) {
    const response = await livestockService.createLivestockGenus(livestockGenus);

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

LivestockRouter.put('/genus', async (req, res) => {
  const genus: string = req.body.genus || '';
  const type: string = req.body.type || '';
  const feed_style: string = req.body.feed_style || LIVESTOCK_FEED_STYLE.UNSPECIFIED;
  const reproduction_style: string = req.body.reproduction_style || REPRODUCTION_STYLE.UNSPECIFIED;
  const temperature_range: TemperatureRange = req.body.temperature_range || {};
  const parameters: ParameterRange = req.body.parameters || {};
  const sensitivity: string[] = req.body.sensitivity || [];

  const livestockGenus: LivestockGenus = {
    genus: genus,
    species: 'genus',
    type: type,
    feed_style: feed_style,
    reproduction_style: reproduction_style,
    temperature_range: temperature_range,
    parameters: parameters,
    sensitivity: sensitivity
  }

  const response = await livestockService.putLivestockGenus(livestockGenus);

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

LivestockRouter.delete('/:genus', async (req, res) => {
  const genus = req.params['genus'];

  const requestValidity = await checkValidLivestockGenusToDelete(genus);

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
    const response = await livestockService.deleteLivestockGenus(genus);

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


LivestockRouter.get('/:genus/:species', async (req, res) => {
  const genus = req.params['genus'];
  const species = req.params['species'];

  const response = await livestockService.getLivestockSpeciesByGenusSpecies(genus, species);

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
// Make it required for difficulty / feed type / etc ( attrs w/ enums ) to only be the values specified in those enums
LivestockRouter.post('/species', async (req, res) => {
  const genus: string = req.body.genus || '';
  const species: string = req.body.species || '';
  const common_name: string = req.body.common_name || '';
  const difficulty: string = req.body.difficulty || LIVESTOCK_DIFFICULTY.UNSPECIFIED;

  const livestockSpecies: LivestockSpecies = {
    genus: genus,
    species: species,
    common_name: common_name,
    difficulty: difficulty
  };

  const requestValidity = await checkValidLivestockSpeciesToCreate(livestockSpecies);

  if (!requestValidity.valid) {
    let statusCode: number;
    switch (requestValidity.message) {
      case RESPONSE_MESSAGE.NOT_FOUND:
      case RESPONSE_MESSAGE.ALREADY_EXISTS:
      case RESPONSE_MESSAGE.INVALID:
        statusCode = 400;
        break;
      default:
        statusCode = 400;
        break;
    }

    res.status(statusCode).send(requestValidity.message);
  }

  if (requestValidity.valid) {
    const response = await livestockService.createLivestockSpecies(livestockSpecies);

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

LivestockRouter.put('/species', async (req, res) => {
  const genus: string = req.body.genus || '';
  const species: string = req.body.species || '';
  const common_name: string = req.body.common_name || '';
  const difficulty: string = req.body.difficulty || LIVESTOCK_DIFFICULTY.UNSPECIFIED;

  const requestValidity = await checkValidLivestockGenusToUse(genus);

  if (!requestValidity.valid) {
    switch (requestValidity.message) {
      case RESPONSE_MESSAGE.INVALID:
      case RESPONSE_MESSAGE.NOT_FOUND:
        res.status(400).send(RESPONSE_MESSAGE.INVALID);
        break;
    }
  }

  if (requestValidity.valid) {
    const livestockSpecies: LivestockSpecies = {
      genus: genus,
      species: species,
      common_name: common_name,
      difficulty: difficulty
    };

    const response = await livestockService.putLivestockSpecies(livestockSpecies);

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

LivestockRouter.delete('/:genus/:species', async (req, res) => {
  const genus = req.params['genus'];
  const species = req.params['species'];

  const response = await livestockService.deleteLivestockSpecies(genus, species);

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