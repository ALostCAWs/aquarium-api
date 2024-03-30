import { LivestockGenus, LivestockSpecies } from "../interfaces/livestockInterface";
import { ParameterRange, ParameterRangeItem, ParameterToleranceItem } from "../interfaces/rangeInterface";
import { LIVESTOCK_TYPE, LIVESTOCK_FEED_STYLE, LIVESTOCK_DIFFICULTY, FISH_REPRODUCTION_STYLE, SHRIMP_REPRODUCTION_STYLE } from "../constants/livestockEnum";
import { RESULTS_UNIT } from "../constants/unitEnum";
import LivestockService from "../services/livestockService";

const livestockService = new LivestockService();

(async () => {
  await livestockService.deleteAllLivestockEntries();
  await loadData();
})();

function loadData() {
  const parameters: ParameterRange = {};
  const neoParameters: ParameterRange = {};

  const NO3 = {
    max: 20,
    unit: RESULTS_UNIT.PPM
  } as ParameterToleranceItem;

  const neoGH = {
    min: 8,
    max: 13,
    unit: RESULTS_UNIT.DEGREES
  } as ParameterRangeItem;

  const neoKH = {
    min: 4,
    max: 7,
    unit: RESULTS_UNIT.DEGREES
  } as ParameterRangeItem;

  parameters[`NO3`] = NO3;

  neoParameters[`NO3`] = NO3;
  neoParameters[`GH`] = neoGH;
  neoParameters[`KH`] = neoKH;

  livestockService.createLivestockGenus({
    genus: `neocaridina`,
    species: `genus`,
    feed_style: LIVESTOCK_FEED_STYLE.DETRITIVORE,
    type: LIVESTOCK_TYPE.SHRIMP,
    reproduction_style: SHRIMP_REPRODUCTION_STYLE.HIGH_ORDER,
    sensitivity: [],
    parameters: neoParameters,
    temperature_range: {
      min: 65,
      max: 84
    }
  } as LivestockGenus);

  livestockService.createLivestockSpecies({
    genus: `neocaridina`,
    species: `davidi`,
    common_name: `cherry shrimp`,
    difficulty: LIVESTOCK_DIFFICULTY.EASY
  } as LivestockSpecies);

  livestockService.createLivestockGenus({
    genus: `betta`,
    species: `genus`,
    feed_style: LIVESTOCK_FEED_STYLE.CARNIVORE,
    type: LIVESTOCK_TYPE.FISH,
    reproduction_style: FISH_REPRODUCTION_STYLE.EGG,
    sensitivity: [],
    parameters: parameters,
    temperature_range: {
      min: 76,
      max: 82
    }
  } as LivestockGenus);

  livestockService.createLivestockSpecies({
    genus: `betta`,
    species: `splendens`,
    common_name: `fighting fish`,
    difficulty: LIVESTOCK_DIFFICULTY.EASY
  } as LivestockSpecies);
}