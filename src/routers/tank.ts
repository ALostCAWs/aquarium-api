import { Router } from 'express';
import TankService from '../services/tankService';
import { RESPONSE_MESSAGE } from '../constants/responseMessage';

export const TankRouter = Router();
const tankService = new TankService();

TankRouter.get('/', async (req, res) => {
  const response = await tankService.getAllTanks();

  switch (response.error) {
    case RESPONSE_MESSAGE.NO_ERROR:
      res.send(response.data);
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

TankRouter.get('/:tankId', async (req, res) => {
  const tank_id = req.params['tankId'];
  const response = await tankService.getTankById(tank_id);

  switch (response.error) {
    case RESPONSE_MESSAGE.NO_ERROR:
      res.send(response.data);
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