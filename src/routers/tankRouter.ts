import { Router } from 'express';
import TankService from '../services/tankService';
import LivestockService from '../services/livestockService';
import PlantService from '../services/plantService';
import { Tank, TankInhabitant } from '../interfaces/tankInterface';
import { RESPONSE_MESSAGE } from '../constants/responseMessageEnum';
import { LightSettings } from '../interfaces/lightInterface';
import { Parameter } from '../interfaces/parameterInterface';
import { TestSchedule } from '../interfaces/testScheduleInterface';
import { WaterChange } from '../interfaces/waterChangeInterface';
import { Ailment } from '../interfaces/ailmentInterface';
import { RecentProduct } from '../interfaces/productInterface';
import { convertInhabitantsToArrayOfObjects } from '../functions/convertData';

export const TankRouter = Router();
const tankService = new TankService();
const livestockService = new LivestockService();
const plantService = new PlantService();

TankRouter.get('/', async (req, res) => {
  const response = await tankService.getAllTanks();

  switch (response.message) {
    case RESPONSE_MESSAGE.NO_ERROR:
      res.status(200).send(response.data);
      break;
    case RESPONSE_MESSAGE.NO_ITEMS_FOUND:
      res.status(404).send(`${RESPONSE_MESSAGE.NO_ITEMS_FOUND} tanks`);
      break;
    case RESPONSE_MESSAGE.INTERNAL:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
    default:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
  }
});

TankRouter.get('/:tank_id', async (req, res) => {
  const tank_id = req.params['tank_id'];
  const response = await tankService.getTankById(tank_id);

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

TankRouter.get('/:tank_id/sensitivity', async (req, res) => {
  const tank_id = req.params['tank_id'];
  const tankLivestock = (await tankService.getTankLivestock(tank_id)).data || [];
  const tankPlants = (await tankService.getTankPlants(tank_id)).data || [];

  const livestock = convertInhabitantsToArrayOfObjects(tankLivestock) as TankInhabitant[];
  const plants = convertInhabitantsToArrayOfObjects(tankPlants) as TankInhabitant[];
  const tankSensitivity = new Set();

  livestock.forEach(async (l) => {
    const sensitivity = await livestockService.getLivestockGenusSensitivity(l.genus) as unknown as string[];
    tankSensitivity.add([...sensitivity]);
  });

  plants.forEach(async (p) => {
    const sensitivity = await plantService.getPlantGenusSensitivity(p.genus) as unknown as string[];
    tankSensitivity.add([...sensitivity]);
  });
});

TankRouter.get('/:tank_id/livestock', async (req, res) => {
  const tank_id = req.params['tank_id'];
  const response = await tankService.getTankLivestock(tank_id);

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
});

TankRouter.get('/:tank_id/plants', async (req, res) => {
  const tank_id = req.params['tank_id'];
  const response = await tankService.getTankPlants(tank_id);

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
});

TankRouter.post('/', async (req, res) => {
  const volume: number = req.body.volume;
  const volume_unit: string = req.body.volume_unit;
  const is_cycled: boolean = req.body.is_cycled;
  const filtration: string = req.body.filtration;
  const substrate: string = req.body.substrate;
  const temperature_setting: number = req.body.temperature_setting;
  const temperature_unit: string = req.body.temperature_unit;
  const livestock: TankInhabitant[] = req.body.livestock || [];
  const plants: TankInhabitant[] = req.body.plants || [];
  const light_settings: LightSettings = req.body.light || {};
  const parameters: Parameter[] = req.body.parameters || [];
  const test_schedule: TestSchedule[] = req.body.test_schedule || [];
  const recent_water_change: WaterChange = req.body.recent_water_change || {};
  const ailments: Ailment[] = req.body.ailments || {};
  const recent_product: RecentProduct = req.body.recent_product || {};
  const recent_substrate_fertilizer: RecentProduct = req.body.recent_product || {};
  const recent_water_fertilizer: RecentProduct = req.body.recent_product || {};

  let tank = {
    id: '',
    volume: volume,
    volume_unit: volume_unit,
    is_cycled: is_cycled,
    filtration: filtration,
    substrate: substrate,
    temperature_setting: temperature_setting,
    temperature_unit: temperature_unit,
    livestock: livestock,
    plants: plants,
    light_settings: light_settings,
    parameters: parameters,
    test_schedule: test_schedule,
    recent_water_change: recent_water_change,
    ailments: ailments,
    recent_product: recent_product,
    recent_substrate_fertilizer: recent_substrate_fertilizer,
    recent_water_fertilizer: recent_water_fertilizer
  }

  const response = await tankService.createTank(tank);

  switch (response.message) {
    case RESPONSE_MESSAGE.NO_ERROR:
      res.status(201).send(response.data);
      break;
    case RESPONSE_MESSAGE.INTERNAL:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
    default:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL)
      break;
  }
});

TankRouter.put('/', async (req, res) => {
  const tank: Tank = req.body;
  const response = await tankService.putTank(tank);

  switch (response.message) {
    case RESPONSE_MESSAGE.NO_ERROR:
      res.status(200).send(response.data);
      break;
    case (RESPONSE_MESSAGE.NOT_FOUND):
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

TankRouter.delete('/:tank_id', async (req, res) => {
  const tank_id = req.params['tank_id'];

  const response = await tankService.deleteTank(tank_id);

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