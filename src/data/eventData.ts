import { EVENT } from "../constants/eventEnum";
import { DOSE_UNIT } from "../constants/unitEnum";
import { Event } from "../interfaces/eventInterface";
import EventService from "../services/eventService";

const eventService = new EventService();

(async () => {
  await eventService.deleteAllEvents();
  await loadData();
})();

function loadData() {
  eventService.createEvent({
    tank_id: `1`,
    timestamp: `1712023800`,
    type: EVENT.WATER_COLUMN_FERTILIZED,
    product_dose: 1,
    product_dose_unit: DOSE_UNIT.MILLILITER,
    water_change_percentage: undefined,
    parameters: undefined,
    light_settings: undefined,
    ailment: undefined,
    comments: undefined
  } as Event);

  eventService.createEvent({
    tank_id: `2`,
    timestamp: `1712023860`,
    type: EVENT.WATER_COLUMN_FERTILIZED,
    product_dose: 0.6,
    product_dose_unit: DOSE_UNIT.MILLILITER,
    water_change_percentage: undefined,
    parameters: undefined,
    light_settings: undefined,
    ailment: undefined,
    comments: undefined
  } as Event);

  eventService.createEvent({
    tank_id: `3`,
    timestamp: `1712023920`,
    type: EVENT.WATER_COLUMN_FERTILIZED,
    product_dose: 0.25,
    product_dose_unit: DOSE_UNIT.MILLILITER,
    water_change_percentage: undefined,
    parameters: undefined,
    light_settings: undefined,
    ailment: undefined,
    comments: undefined
  } as Event);

  eventService.createEvent({
    tank_id: `4`,
    timestamp: `1712023980`,
    type: EVENT.WATER_COLUMN_FERTILIZED,
    product_dose: 0.6,
    product_dose_unit: DOSE_UNIT.MILLILITER,
    water_change_percentage: undefined,
    parameters: undefined,
    light_settings: undefined,
    ailment: undefined,
    comments: undefined
  } as Event);
}