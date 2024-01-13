import { Router } from 'express';
import PlantService from '../services/plantService';
import { PlantGenus, PlantSpecies } from '../interfaces/plantInterface';
import { RESPONSE_MESSAGE } from '../constants/responseMessageEnum';

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

PlantRouter.post('/', async (req, res) => {
  const plant_genus: string = req.body.genus;
  const plant_species: string = req.body.species;
  const CO2: boolean = req.body.CO2;
  const difficulty: string = req.body.difficulty;
  const commonName: string = req.body.commonName;
  const light: string = req.body.light;

  const genusExists = await plantService.checkSpeciesExists(plant_genus, plant_species);
  if (!genusExists) {
    console.error(`failed to create species ${plant_species}: genus ${plant_genus} ${RESPONSE_MESSAGE.NOT_FOUND}`);
    res.status(404).send(RESPONSE_MESSAGE.NOT_FOUND);
  }

  const speciesExists = await plantService.checkSpeciesExists(plant_genus, plant_species);
  if (speciesExists) {
    console.error(`failed to create plant ${plant_genus} ${plant_species}: already exists`);
    res.status(400).send(RESPONSE_MESSAGE.ALREADY_EXISTS);
  }

  if (genusExists && !speciesExists) {
    const plant: PlantSpecies = {
      genus: plant_genus,
      species: plant_species,
      CO2: CO2,
      difficulty: difficulty,
      commonName: commonName,
      light: light
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