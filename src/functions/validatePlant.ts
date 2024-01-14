import PlantService from "../services/plantService";
import { RESPONSE_MESSAGE } from "../constants/responseMessageEnum";
import { checkStringValid } from "./validateInput";
import { PlantGenus, PlantSpecies } from "../interfaces/plantInterface";

const plantService = new PlantService();

interface ValidityCheckResponse {
  valid: boolean,
  message: string
}

export const checkValidPlantGenusToUse = async (genus: string): Promise<ValidityCheckResponse> => {
  if (!checkStringValid(genus)) {
    return {
      valid: false,
      message: RESPONSE_MESSAGE.INVALID
    };
  }

  const exists = await plantService.checkGenusExists(genus);

  if (!exists) {
    console.error(`failed to get genus ${genus}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.NOT_FOUND
    };
  }

  return {
    valid: true,
    message: RESPONSE_MESSAGE.NO_ERROR
  };
}

export const checkValidPlantGenusToCreate = async (plantGenus: PlantGenus): Promise<ValidityCheckResponse> => {
  const genus = plantGenus.genus;

  if (!checkStringValid(genus)) {
    return {
      valid: false,
      message: RESPONSE_MESSAGE.INVALID
    };
  }

  const exists = await plantService.checkGenusExists(genus);

  if (exists) {
    console.error(`failed to create genus ${genus}: ${RESPONSE_MESSAGE.ALREADY_EXISTS}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.ALREADY_EXISTS
    };
  }

  return {
    valid: true,
    message: RESPONSE_MESSAGE.NO_ERROR
  };
}

export const checkValidPlantGenusToDelete = async (genus: string): Promise<ValidityCheckResponse> => {
  // Check genus is valid to use
  const validGenus = await checkValidPlantGenusToUse(genus);

  if (validGenus.message === RESPONSE_MESSAGE.INVALID) {
    console.error(`failed to delete genus ${genus}: genus ${RESPONSE_MESSAGE.INVALID}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.INVALID
    };
  }
  if (validGenus.message === RESPONSE_MESSAGE.NOT_FOUND) {
    console.error(`failed to delete genus ${genus}: genus ${RESPONSE_MESSAGE.NOT_FOUND}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.NOT_FOUND
    };
  }

  const hasSpecies = await plantService.checkGenusHasSpecies(genus);

  if (hasSpecies) {
    console.error(`failed to delete genus ${genus}: genus ${RESPONSE_MESSAGE.HAS_SPECIES}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.HAS_SPECIES
    };
  }

  return {
    valid: true,
    message: RESPONSE_MESSAGE.NO_ERROR
  };
}

export const checkValidPlantSpeciesToUse = async (plantSpecies: PlantSpecies): Promise<ValidityCheckResponse> => {
  // Check genus is valid to use
  const genus = plantSpecies.genus;
  const species = plantSpecies.species;
  const validGenus = await checkValidPlantGenusToUse(genus);

  if (validGenus.message === RESPONSE_MESSAGE.INVALID) {
    console.error(`failed to get plant ${genus} ${species}: genus ${RESPONSE_MESSAGE.INVALID}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.INVALID
    };
  }
  if (validGenus.message === RESPONSE_MESSAGE.NOT_FOUND) {
    console.error(`failed to get plant ${genus} ${species}: genus ${RESPONSE_MESSAGE.NOT_FOUND}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.NOT_FOUND
    };
  }

  // Check species is valid to use
  if (!checkStringValid(species)) {
    return {
      valid: false,
      message: RESPONSE_MESSAGE.INVALID
    };
  }

  const exists = await plantService.checkSpeciesExists(genus, species);

  if (!exists) {
    console.error(`failed to get plant ${genus} ${species}: species ${RESPONSE_MESSAGE.NOT_FOUND}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.NOT_FOUND
    };
  }

  return {
    valid: true,
    message: RESPONSE_MESSAGE.NO_ERROR
  };
}

export const checkValidPlantSpeciesToCreate = async (plantSpecies: PlantSpecies): Promise<ValidityCheckResponse> => {
  // Check genus is valid to use
  const genus = plantSpecies.genus;
  const species = plantSpecies.species;
  const validGenus = await checkValidPlantGenusToUse(genus);

  if (validGenus.message === RESPONSE_MESSAGE.INVALID) {
    console.error(`failed to create plant ${genus} ${species}: genus ${RESPONSE_MESSAGE.INVALID}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.INVALID
    };
  }
  if (validGenus.message === RESPONSE_MESSAGE.NOT_FOUND) {
    console.error(`failed to create plant ${genus} ${species}: genus ${RESPONSE_MESSAGE.NOT_FOUND}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.NOT_FOUND
    };
  }

  // Check species is valid to create
  if (!checkStringValid(species)) {
    console.error(`failed to create plant ${genus} ${species}: species ${RESPONSE_MESSAGE.INVALID}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.INVALID
    };
  }

  const exists = await plantService.checkSpeciesExists(genus, species);
  if (exists) {
    console.error(`failed to create plant ${genus} ${species}: species ${RESPONSE_MESSAGE.ALREADY_EXISTS}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.ALREADY_EXISTS
    };
  }

  return {
    valid: true,
    message: RESPONSE_MESSAGE.NO_ERROR
  };
}