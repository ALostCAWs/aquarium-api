import { PlantGenus, PlantSpecies } from "../interfaces/plantInterface";
import { ParameterRange, ParameterRequirementItem } from "../interfaces/rangeInterface";
import { PLANT_TYPE, PLANT_FEED_STYLE, PLANT_DIFFICULTY, PLANT_GROWTH_RATE, PLANT_LIGHT } from "../constants/plantEnum";
import { RESULTS_UNIT } from "../constants/unitEnum";
import PlantService from "../services/plantService";

const plantService = new PlantService();

(async () => {
  await plantService.deleteAllPLantEntries();
  await loadData();
})();

function loadData() {
  const parameters: ParameterRange = {};

  const NO3 = {
    min: 10,
    unit: RESULTS_UNIT.PPM
  } as ParameterRequirementItem;

  parameters[`NO3`] = NO3;

  plantService.createPlantGenus({
    genus: `anubias`,
    species: `genus`,
    feed_style: PLANT_FEED_STYLE.WATER_COLUMN,
    sensitivity: [],
    type: PLANT_TYPE.RHIZOME,
    growth_rate: PLANT_GROWTH_RATE.SLOW,
    parameters: parameters,
    temperature_range: {
      min: 72,
      max: 82
    }
  } as PlantGenus);

  plantService.createPlantSpecies({
    genus: `anubias`,
    species: `barteri`,
    CO2: false,
    common_name: ``,
    difficulty: PLANT_DIFFICULTY.EASY,
    light: PLANT_LIGHT.LOW
  } as PlantSpecies);

  plantService.createPlantSpecies({
    genus: `anubias`,
    species: `gracilis`,
    CO2: false,
    common_name: ``,
    difficulty: PLANT_DIFFICULTY.EASY,
    light: PLANT_LIGHT.LOW
  } as PlantSpecies);


  plantService.createPlantGenus({
    genus: `cryptocoryne`,
    species: `genus`,
    feed_style: PLANT_FEED_STYLE.ROOT,
    sensitivity: [],
    type: PLANT_TYPE.ROSULATE,
    growth_rate: PLANT_GROWTH_RATE.SLOW,
    parameters: parameters,
    temperature_range: {
      min: 70,
      max: 80
    }
  } as PlantGenus);

  plantService.createPlantSpecies({
    genus: `cryptocoryne`,
    species: `wendtii 'red'`,
    CO2: false,
    common_name: ``,
    difficulty: PLANT_DIFFICULTY.EASY,
    light: PLANT_LIGHT.MODERATE
  } as PlantSpecies);


  plantService.createPlantGenus({
    genus: `hygrophila`,
    species: `genus`,
    feed_style: PLANT_FEED_STYLE.ROOT,
    sensitivity: [],
    type: PLANT_TYPE.STEM,
    growth_rate: PLANT_GROWTH_RATE.FAST,
    parameters: parameters,
    temperature_range: {
      min: 72,
      max: 82
    }
  } as PlantGenus);

  plantService.createPlantSpecies({
    genus: `hygrophila`,
    species: `corymbosa 'siamensis 53B'`,
    CO2: false,
    common_name: ``,
    difficulty: PLANT_DIFFICULTY.EASY,
    light: PLANT_LIGHT.LOW_MODERATE
  } as PlantSpecies);

  plantService.createPlantSpecies({
    genus: `hygrophila`,
    species: `corymbosa 'compact'`,
    CO2: false,
    common_name: ``,
    difficulty: PLANT_DIFFICULTY.EASY,
    light: PLANT_LIGHT.LOW_MODERATE
  } as PlantSpecies);

  plantService.createPlantSpecies({
    genus: `hygrophila`,
    species: `polysperma 'rosanervig'`,
    CO2: false,
    common_name: `sunset`,
    difficulty: PLANT_DIFFICULTY.EASY,
    light: PLANT_LIGHT.LOW_MODERATE
  } as PlantSpecies);


  plantService.createPlantGenus({
    genus: `limnobium`,
    species: `genus`,
    feed_style: PLANT_FEED_STYLE.WATER_COLUMN,
    sensitivity: [],
    type: PLANT_TYPE.FLOATING,
    growth_rate: PLANT_GROWTH_RATE.FAST,
    parameters: parameters,
    temperature_range: {
      min: 64,
      max: 86
    }
  } as PlantGenus);

  plantService.createPlantSpecies({
    genus: `limnobium`,
    species: `laevigatum`,
    CO2: false,
    common_name: `amazon frogbit`,
    difficulty: PLANT_DIFFICULTY.EASY,
    light: PLANT_LIGHT.LOW
  } as PlantSpecies);


  plantService.createPlantGenus({
    genus: `microsorum`,
    species: `genus`,
    feed_style: PLANT_FEED_STYLE.WATER_COLUMN,
    sensitivity: [],
    type: PLANT_TYPE.RHIZOME,
    growth_rate: PLANT_GROWTH_RATE.SLOW,
    parameters: parameters,
    temperature_range: {
      min: 68,
      max: 82
    }
  } as PlantGenus);

  plantService.createPlantSpecies({
    genus: `microsorum`,
    species: `pteropus`,
    CO2: false,
    common_name: `java fern`,
    difficulty: PLANT_DIFFICULTY.EASY,
    light: PLANT_LIGHT.LOW_MODERATE
  } as PlantSpecies);


  plantService.createPlantGenus({
    genus: `nymphoides`,
    species: `genus`,
    feed_style: PLANT_FEED_STYLE.WATER_COLUMN,
    sensitivity: [],
    type: PLANT_TYPE.RHIZOME,
    growth_rate: PLANT_GROWTH_RATE.FAST,
    parameters: parameters,
    temperature_range: {
      min: 68,
      max: 82
    }
  } as PlantGenus);

  plantService.createPlantSpecies({
    genus: `nymphoides`,
    species: `hydrophylla 'taiwan'`,
    CO2: false,
    common_name: ``,
    difficulty: PLANT_DIFFICULTY.EASY,
    light: PLANT_LIGHT.LOW_MODERATE
  } as PlantSpecies);


  plantService.createPlantGenus({
    genus: `rorippa`,
    species: `genus`,
    feed_style: PLANT_FEED_STYLE.ROOT,
    sensitivity: [],
    type: PLANT_TYPE.ROSULATE,
    growth_rate: PLANT_GROWTH_RATE.SLOW,
    parameters: parameters,
    temperature_range: {
      min: 68,
      max: 77
    }
  } as PlantGenus);

  plantService.createPlantSpecies({
    genus: `rorippa`,
    species: `aquatica`,
    CO2: false,
    common_name: `water cabbage`,
    difficulty: PLANT_DIFFICULTY.EASY,
    light: PLANT_LIGHT.LOW
  } as PlantSpecies);


  plantService.createPlantGenus({
    genus: `sagittaria`,
    species: `genus`,
    feed_style: PLANT_FEED_STYLE.ROOT,
    sensitivity: [],
    type: PLANT_TYPE.STOLON,
    growth_rate: PLANT_GROWTH_RATE.FAST,
    parameters: parameters,
    temperature_range: {
      min: 70,
      max: 82
    }
  } as PlantGenus);

  plantService.createPlantSpecies({
    genus: `sagittaria`,
    species: `subulata`,
    CO2: false,
    common_name: `dwarf sagittaria`,
    difficulty: PLANT_DIFFICULTY.EASY,
    light: PLANT_LIGHT.LOW_MODERATE
  } as PlantSpecies);


  plantService.createPlantGenus({
    genus: `vallisneria`,
    species: `genus`,
    feed_style: PLANT_FEED_STYLE.ROOT,
    sensitivity: [`Seachem Flourish Excel`],
    type: PLANT_TYPE.STOLON,
    growth_rate: PLANT_GROWTH_RATE.FAST,
    parameters: parameters,
    temperature_range: {
      min: 64,
      max: 82
    }
  } as PlantGenus);

  plantService.createPlantSpecies({
    genus: `vallisneria`,
    species: `nana`,
    CO2: false,
    common_name: `narrowleaf`,
    difficulty: PLANT_DIFFICULTY.EASY,
    light: PLANT_LIGHT.LOW_MODERATE
  } as PlantSpecies);

  plantService.createPlantSpecies({
    genus: `vallisneria`,
    species: `americana`,
    CO2: false,
    common_name: `jungle`,
    difficulty: PLANT_DIFFICULTY.EASY,
    light: PLANT_LIGHT.LOW_MODERATE
  } as PlantSpecies);

  plantService.createPlantSpecies({
    genus: `vallisneria`,
    species: `spiralis leopard`,
    CO2: false,
    common_name: `leopard`,
    difficulty: PLANT_DIFFICULTY.EASY,
    light: PLANT_LIGHT.LOW_MODERATE
  } as PlantSpecies);
}