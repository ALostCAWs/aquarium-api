import { Tank, Parameter, RecentProduct, TankInhabitant, TestSchedule, WaterChange } from "../interfaces/tankInterface";
import { WATER_TYPE } from "../constants/waterEnum";
import { PLANT_LIGHT } from "../constants/plantEnum";
import { RESULTS_UNIT, VOLUME_UNIT, TEMPERATURE_UNIT, DOSE_UNIT } from "../constants/unitEnum";
import TankService from "../services/tankService";

const tankService = new TankService();

(async () => {
  await tankService.deleteAllTanks();
  loadData();
})();

function loadData() {
  const neoTankLivestock: TankInhabitant[] = [];
  const tank1Livestock: TankInhabitant[] = [];
  const nDavidi = {
    genus: `neocaridina`,
    species: `davidi`
  } as TankInhabitant;
  neoTankLivestock.push(nDavidi);

  const bettaTankLivestock: TankInhabitant[] = [];
  const bSplendens = {
    genus: `betta`,
    species: `splendens`
  } as TankInhabitant;
  bettaTankLivestock.push(bSplendens);

  const vSemiconica = {
    genus: `vittina`,
    species: `semiconica`
  } as TankInhabitant;
  tank1Livestock.push(...neoTankLivestock, vSemiconica);


  const plants_1: TankInhabitant[] = [];
  const plants_2: TankInhabitant[] = [];
  const plants_3: TankInhabitant[] = [];
  const plants_4: TankInhabitant[] = [];

  const aBarteri = {
    genus: `anubias`,
    species: `barteri`
  } as TankInhabitant;
  const aGracilis = {
    genus: `anubias`,
    species: `gracilis`
  } as TankInhabitant;

  const bCaroliniana = {
    genus: `bacopa`,
    species: `caroliniana`
  } as TankInhabitant;

  const bPygmaeaBukitKelam = {
    genus: `bucephalandra`,
    species: `pygmaea 'bukit kelam'`
  } as TankInhabitant;

  const cWendtiiRed = {
    genus: `cryptocoryne`,
    species: `wendtii 'red'`
  } as TankInhabitant;

  const hPolyspermaRosanervig = {
    genus: `hygrophila`,
    species: `polysperma 'rosanervig'`
  } as TankInhabitant;
  const hCorymbosaCompact = {
    genus: `hygrophila`,
    species: `corymbosa 'compact'`
  } as TankInhabitant;
  const hCorymbosaSiam = {
    genus: `hygrophila`,
    species: `corymbosa 'siamensis 53B'`
  } as TankInhabitant;

  const lLaevigatum = {
    genus: `limnobium`,
    species: `laevigatum`
  } as TankInhabitant;

  const mPteropus = {
    genus: `microsorum`,
    species: `pteropus`
  } as TankInhabitant;

  const nHydrophyllaTai = {
    genus: `nymphoides`,
    species: `hydrophylla 'taiwan'`
  } as TankInhabitant;

  const rAquatica = {
    genus: `rorippa`,
    species: `aquatica`
  } as TankInhabitant;

  const sSubulata = {
    genus: `sagittaria`,
    species: `subulata`
  } as TankInhabitant;

  const vNana = {
    genus: `vallisneria`,
    species: `nana`
  } as TankInhabitant;

  plants_1.push(aBarteri);
  plants_1.push(bCaroliniana);
  plants_1.push(bPygmaeaBukitKelam);
  plants_1.push(hCorymbosaSiam);
  plants_1.push(lLaevigatum);
  plants_1.push(nHydrophyllaTai);
  plants_1.push(rAquatica);
  plants_1.push(vNana);

  plants_2.push(bCaroliniana);
  plants_2.push(hPolyspermaRosanervig);
  plants_2.push(lLaevigatum);
  plants_2.push(mPteropus);
  plants_2.push(vNana);

  plants_3.push(cWendtiiRed);
  plants_3.push(nHydrophyllaTai);
  plants_3.push(lLaevigatum);
  plants_3.push(sSubulata);

  plants_4.push(hCorymbosaCompact);
  plants_4.push(nHydrophyllaTai);

  const fishTestSchedule: TestSchedule[] = [];
  const shrimpTestSchedule: TestSchedule[] = [];

  const NO3_testWeekly = {
    parameter: `NO3`,
    frequency: 7
  } as TestSchedule;
  const GH_testWeekly = {
    parameter: `GH`,
    frequency: 7
  } as TestSchedule;
  const KH_testWeekly = {
    parameter: `KH`,
    frequency: 7
  } as TestSchedule;

  fishTestSchedule.push(NO3_testWeekly);
  shrimpTestSchedule.push(NO3_testWeekly);
  shrimpTestSchedule.push(GH_testWeekly);
  shrimpTestSchedule.push(KH_testWeekly);


  const parameters_1: Parameter[] = [];
  const parameters_2: Parameter[] = [];
  const parameters_3: Parameter[] = [];

  const parameterNH3_1 = {
    parameter: `NH3`,
    result: 0,
    result_unit: RESULTS_UNIT.PPM,
    timestamp: `1710062950000`,
  } as Parameter;
  const parameterNO2_1 = {
    parameter: `NO2`,
    result: 0,
    result_unit: RESULTS_UNIT.PPM,
    timestamp: `1710062965000`
  } as Parameter;
  const parameterNO3_1 = {
    parameter: `NO3`,
    result: 10,
    result_unit: RESULTS_UNIT.PPM,
    timestamp: `1710063565000`
  } as Parameter;
  const parameterGH_1 = {
    parameter: `GH`,
    result: 12,
    result_unit: RESULTS_UNIT.DEGREES,
    timestamp: `1710063610000`
  } as Parameter;
  const parameterKH_1 = {
    parameter: `KH`,
    result: 6,
    result_unit: RESULTS_UNIT.DEGREES,
    timestamp: `1710063850000`
  } as Parameter;

  const parameterNH3_2 = {
    parameter: `NH3`,
    result: 0,
    result_unit: RESULTS_UNIT.PPM,
    timestamp: `1710067450000`
  } as Parameter;
  const parameterNO2_2 = {
    parameter: `NO2`,
    result: 0,
    result_unit: RESULTS_UNIT.PPM,
    timestamp: `1710067460000`
  } as Parameter;
  const parameterNO3_2 = {
    parameter: `NO3`,
    result: 10,
    result_unit: RESULTS_UNIT.PPM,
    timestamp: `1710067760000`
  } as Parameter;
  const parameterGH_2 = {
    parameter: `GH`,
    result: 12,
    result_unit: RESULTS_UNIT.DEGREES,
    timestamp: `1710067940000`
  } as Parameter;
  const parameterKH_2 = {
    parameter: `KH`,
    result: 6,
    result_unit: RESULTS_UNIT.DEGREES,
    timestamp: `1710068120000`
  } as Parameter;

  const parameterNH3_3 = {
    parameter: `NH3`,
    result: 0,
    result_unit: RESULTS_UNIT.PPM,
    timestamp: `1710068420000`
  } as Parameter;
  const parameterNO2_3 = {
    parameter: `NO2`,
    result: 0,
    result_unit: RESULTS_UNIT.PPM,
    timestamp: `1710068430000`
  } as Parameter;
  const parameterNO3_3 = {
    parameter: `NO3`,
    result: 10,
    result_unit: RESULTS_UNIT.PPM,
    timestamp: `1710068850000`
  } as Parameter;

  parameters_1.push(parameterNH3_1);
  parameters_1.push(parameterNO2_1);
  parameters_1.push(parameterNO3_1);
  parameters_1.push(parameterGH_1);
  parameters_1.push(parameterKH_1);

  parameters_2.push(parameterNH3_2);
  parameters_2.push(parameterNO2_2);
  parameters_2.push(parameterNO3_2);
  parameters_2.push(parameterGH_2);
  parameters_2.push(parameterKH_2);

  parameters_3.push(parameterNH3_3);
  parameters_3.push(parameterNO2_3);
  parameters_3.push(parameterNO3_3);

  tankService.createTank({
    id: `1`,
    volume: 10,
    volume_unit: VOLUME_UNIT.GALLON,
    is_cycled: true,
    filtration: `sponge`,
    substrate: `Seachem Flourite Black`,
    temperature_setting: 76,
    temperature_unit: TEMPERATURE_UNIT.FAHRENHEIT,
    livestock: tank1Livestock,
    plants: plants_1,
    light_settings: {
      percentage: 45,
      hours_on: 7,
      name: `Nicrew ClassicLED Plus`,
      strength: PLANT_LIGHT.LOW_MODERATE
    },
    parameters: parameters_2,
    test_schedule: shrimpTestSchedule,
    recent_water_change: {
      percentage: 50,
      water_type: WATER_TYPE.TAP,
      timestamp: `1708573216000`
    } as WaterChange,
    ailments: [],
    recent_product: {} as RecentProduct,
    recent_substrate_fertilizer: {
      name: `Seachem Flourish Tabs`,
      dose: 3,
      unit: DOSE_UNIT.TABS,
      timestamp: `1712585544000`
    } as RecentProduct,
    recent_water_fertilizer: {
      name: `Seachem Flourish Potassium`,
      dose: 1.6,
      unit: DOSE_UNIT.MILLILITER,
      timestamp: `1712695510000`
    } as RecentProduct,
  } as Tank);

  tankService.createTank({
    id: `2`,
    volume: 5.5,
    volume_unit: VOLUME_UNIT.GALLON,
    is_cycled: true,
    filtration: `sponge`,
    substrate: `Stoney River Premium Aquarium Sand`,
    temperature_setting: 78,
    temperature_unit: TEMPERATURE_UNIT.FAHRENHEIT,
    livestock: neoTankLivestock,
    plants: plants_2,
    light_settings: {
      percentage: 35,
      hours_on: 6,
      name: `Nicrew ClassicLED Plus`,
      strength: PLANT_LIGHT.LOW_MODERATE
    },
    parameters: parameters_2,
    test_schedule: shrimpTestSchedule,
    recent_water_change: {
      percentage: 20,
      water_type: WATER_TYPE.RO,
      timestamp: `1709295210000`
    } as WaterChange,
    ailments: [],
    recent_product: {} as RecentProduct,
    recent_substrate_fertilizer: {
      name: `Seachem Flourish Tabs`,
      dose: 2,
      unit: DOSE_UNIT.TABS,
      timestamp: `1712695930000`
    } as RecentProduct,
    recent_water_fertilizer: {
      name: `Seachem Flourish Potassium`,
      dose: 0.75,
      unit: DOSE_UNIT.MILLILITER,
      timestamp: `1712695513000`
    } as RecentProduct,
  } as Tank);

  tankService.createTank({
    id: `3`,
    volume: 3,
    volume_unit: VOLUME_UNIT.GALLON,
    is_cycled: true,
    filtration: `sponge`,
    substrate: `Stoney River Premium Aquarium Sand`,
    temperature_setting: 78,
    temperature_unit: TEMPERATURE_UNIT.FAHRENHEIT,
    livestock: neoTankLivestock,
    plants: plants_3,
    light_settings: {
      percentage: 35,
      hours_on: 6,
      name: `Nicrew ClassicLED Plus`,
      strength: PLANT_LIGHT.LOW_MODERATE
    },
    parameters: parameters_3,
    test_schedule: shrimpTestSchedule,
    recent_water_change: {
      percentage: 30,
      water_type: WATER_TYPE.RO,
      timestamp: `1712696025000`
    } as WaterChange,
    ailments: [],
    recent_product: {} as RecentProduct,
    recent_substrate_fertilizer: {
      name: `Seachem Flourish Tabs`,
      dose: 2,
      unit: DOSE_UNIT.TABS,
      timestamp: `1712739072000`
    } as RecentProduct,
    recent_water_fertilizer: {
      name: `Seachem Flourish Potassium`,
      dose: 0.5,
      unit: DOSE_UNIT.MILLILITER,
      timestamp: `1712695517000`
    } as RecentProduct,
  } as Tank);

  tankService.createTank({
    id: `4`,
    volume: 6,
    volume_unit: VOLUME_UNIT.GALLON,
    is_cycled: true,
    filtration: `sponge`,
    substrate: `Stoney River Premium Aquarium Sand`,
    temperature_setting: 78,
    temperature_unit: TEMPERATURE_UNIT.FAHRENHEIT,
    livestock: bettaTankLivestock,
    plants: plants_4,
    light_settings: {
      percentage: 100,
      hours_on: 6,
      name: `Topfin 6gal Corner Tank Built-in`,
      strength: PLANT_LIGHT.LOW
    },
    parameters: parameters_3,
    test_schedule: fishTestSchedule,
    recent_water_change: {
      percentage: 30,
      water_type: WATER_TYPE.TAP,
      timestamp: `1707741210000`
    } as WaterChange,
    ailments: [],
    recent_product: {} as RecentProduct,
    recent_substrate_fertilizer: {} as RecentProduct,
    recent_water_fertilizer: {} as RecentProduct,
  } as Tank);
}