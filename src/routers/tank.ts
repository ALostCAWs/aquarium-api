import { Router } from 'express';
import TankService from '../services/tankService';
import { Tank } from '../interfaces/tankInterface';
import { RESPONSE_MESSAGE } from '../constants/responseMessage';

export const TankRouter = Router();
const tankService = new TankService();

TankRouter.get('/', async (req, res) => {
  const response = await tankService.getAllTanks();

  switch (response.error) {
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

  switch (response.error) {
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

TankRouter.post('/', async (req, res) => {
  const volume: number = req.body.volume;
  const volume_unit: string = req.body.volume_unit;
  const is_cycled: boolean = req.body.volume;

  let tank = {
    id: '',
    volume: volume,
    volume_unit: volume_unit,
    is_cycled: is_cycled,
  }

  const response = await tankService.createTank(tank);

  switch (response.error) {
    case RESPONSE_MESSAGE.NO_ERROR:
      res.status(201).send(response);
      break;
    case RESPONSE_MESSAGE.INTERNAL:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL);
      break;
    default:
      res.status(500).send(RESPONSE_MESSAGE.INTERNAL)
      break;
  }
});