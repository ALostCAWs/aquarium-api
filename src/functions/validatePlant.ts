import PlantService from "../services/plantService";
import { RESPONSE_MESSAGE } from "../constants/responseMessageEnum";
import { checkStringValid } from "./validateInput";
import { PlantSpecies } from "../interfaces/plantInterface";

const plantService = new PlantService();

interface ValidityCheckResponse {
  valid: boolean,
  message: string
}

export const checkValidGenusToUse = async (genus: string): Promise<ValidityCheckResponse> => {
  if (!checkStringValid(genus)) {
    return {
      valid: false,
      message: RESPONSE_MESSAGE.INVALID
    };
  }

  const exists = await plantService.checkGenusExists(genus);

  if (!exists) {
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

export const checkValidGenusToCreate = async (genus: string): Promise<ValidityCheckResponse> => {
  if (!checkStringValid(genus)) {
    return {
      valid: false,
      message: RESPONSE_MESSAGE.INVALID
    };
  }

  const exists = await plantService.checkGenusExists(genus);

  if (exists) {
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

export const checkValidSpeciesToCreate = async (plantSpecies: PlantSpecies): Promise<ValidityCheckResponse> => {
  // Check genus is valid to use
  const genus = plantSpecies.genus;
  const species = plantSpecies.species;
  const validGenus = await checkValidGenusToUse(genus);

  if (!validGenus.valid && validGenus.message === RESPONSE_MESSAGE.INVALID) {
    console.error(`failed to create plant ${genus} ${species}: genus ${RESPONSE_MESSAGE.NOT_FOUND}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.INVALID
    };
  }
  if (!validGenus.valid && validGenus.message === RESPONSE_MESSAGE.NOT_FOUND) {
    console.error(`failed to create plant ${genus} ${species}: species ${RESPONSE_MESSAGE.INVALID}`);
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