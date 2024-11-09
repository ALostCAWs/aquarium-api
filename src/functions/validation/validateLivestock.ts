import LivestockService from "../../services/livestockService";
import { RESPONSE_MESSAGE } from "../../constants/responseMessageEnum";
import { validateString } from "./validateInput";
import { LivestockGenus, LivestockSpecies } from "../../interfaces/livestockInterface";

const livestockService = new LivestockService();

interface ValidityCheckResponse {
  valid: boolean,
  message: string
}

export const checkValidLivestockGenusToUse = async (genus: string): Promise<ValidityCheckResponse> => {
  if (!validateString(genus)) {
    return {
      valid: false,
      message: RESPONSE_MESSAGE.INVALID
    };
  }

  const exists = await livestockService.checkGenusExists(genus);

  if (!exists) {
    console.error(`failed to get livestock genus ${genus}`);
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

export const checkValidLivestockGenusToCreate = async (livestockGenus: LivestockGenus): Promise<ValidityCheckResponse> => {
  const genus = livestockGenus.genus;

  if (!validateString(genus)) {
    return {
      valid: false,
      message: RESPONSE_MESSAGE.INVALID
    };
  }

  const exists = await livestockService.checkGenusExists(genus);

  if (exists) {
    console.error(`failed to create livestock genus ${genus}: ${RESPONSE_MESSAGE.ALREADY_EXISTS}`);
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

export const checkValidLivestockGenusToDelete = async (genus: string): Promise<ValidityCheckResponse> => {
  // Check genus is valid to use
  const validGenus = await checkValidLivestockGenusToUse(genus);

  if (validGenus.message === RESPONSE_MESSAGE.INVALID) {
    console.error(`failed to delete livestock genus ${genus}: genus ${RESPONSE_MESSAGE.INVALID}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.INVALID
    };
  }
  if (validGenus.message === RESPONSE_MESSAGE.NOT_FOUND) {
    console.error(`failed to delete livestock genus ${genus}: genus ${RESPONSE_MESSAGE.NOT_FOUND}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.NOT_FOUND
    };
  }

  const hasSpecies = await livestockService.checkGenusHasSpecies(genus);

  if (hasSpecies) {
    console.error(`failed to delete livestock genus ${genus}: genus ${RESPONSE_MESSAGE.HAS_SPECIES}`);
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

export const checkValidLivestockSpeciesToUse = async (livestockSpecies: LivestockSpecies): Promise<ValidityCheckResponse> => {
  // Check genus is valid to use
  const genus = livestockSpecies.genus;
  const species = livestockSpecies.species;
  const validGenus = await checkValidLivestockGenusToUse(genus);

  if (validGenus.message === RESPONSE_MESSAGE.INVALID) {
    console.error(`failed to get livestock ${genus} ${species}: genus ${RESPONSE_MESSAGE.INVALID}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.INVALID
    };
  }
  if (validGenus.message === RESPONSE_MESSAGE.NOT_FOUND) {
    console.error(`failed to get livestock ${genus} ${species}: genus ${RESPONSE_MESSAGE.NOT_FOUND}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.NOT_FOUND
    };
  }

  // Check species is valid to use
  if (!validateString(species)) {
    return {
      valid: false,
      message: RESPONSE_MESSAGE.INVALID
    };
  }

  const exists = await livestockService.checkSpeciesExists(genus, species);

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

export const checkValidLivestockSpeciesToCreate = async (livestockSpecies: LivestockSpecies): Promise<ValidityCheckResponse> => {
  // Check genus is valid to use
  const genus = livestockSpecies.genus;
  const species = livestockSpecies.species;
  const validGenus = await checkValidLivestockGenusToUse(genus);

  if (validGenus.message === RESPONSE_MESSAGE.INVALID) {
    console.error(`failed to create livestock ${genus} ${species}: genus ${RESPONSE_MESSAGE.INVALID}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.INVALID
    };
  }
  if (validGenus.message === RESPONSE_MESSAGE.NOT_FOUND) {
    console.error(`failed to create livestock ${genus} ${species}: genus ${RESPONSE_MESSAGE.NOT_FOUND}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.NOT_FOUND
    };
  }

  // Check species is valid to create
  if (!validateString(species)) {
    console.error(`failed to create livestock ${genus} ${species}: species ${RESPONSE_MESSAGE.INVALID}`);
    return {
      valid: false,
      message: RESPONSE_MESSAGE.INVALID
    };
  }

  const exists = await livestockService.checkSpeciesExists(genus, species);
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