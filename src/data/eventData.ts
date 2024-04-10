import { Event, RecentProductEvent,  } from "../interfaces/eventInterface";
import { EVENT } from "../constants/eventEnum";
import { DOSE_UNIT } from "../constants/unitEnum";
import EventService from "../services/eventService";
import { TankInhabitant } from "../interfaces/tankInterface";

const eventService = new EventService();

(async () => {
  await eventService.deleteAllEvents();
  loadData();
})();

function loadData() {
  const tank1_update1712110200000 = {
    name: `Aquarium Co-Op Easy Green`,
    dose: 1,
    unit: DOSE_UNIT.MILLILITER
  } as RecentProductEvent;
  eventService.createEvent({
    tank_id: `1`,
    timestamp: `1712110200000`,
    type: EVENT.WATER_COLUMN_FERTILIZED,
    update: tank1_update1712110200000,
    comments: undefined
  } as Event);
  const tank2_update1712110260000 = {
    name: `Aquarium Co-Op Easy Green`,
    dose: 0.6,
    unit: DOSE_UNIT.MILLILITER
  } as RecentProductEvent;
  eventService.createEvent({
    tank_id: `2`,
    timestamp: `1712110260000`,
    type: EVENT.WATER_COLUMN_FERTILIZED,
    update: tank2_update1712110260000,
    comments: undefined
  } as Event);
  const tank3_update1712110320000 = {
    name: `Aquarium Co-Op Easy Green`,
    dose: 0.25,
    unit: DOSE_UNIT.MILLILITER
  } as RecentProductEvent;
  eventService.createEvent({
    tank_id: `3`,
    timestamp: `1712110320000`,
    type: EVENT.WATER_COLUMN_FERTILIZED,
    update: tank3_update1712110320000,
    comments: undefined
  } as Event);
  const tank4_update1712110380000 = {
    name: `Aquarium Co-Op Easy Green`,
    dose: 0.6,
    unit: DOSE_UNIT.MILLILITER
  } as RecentProductEvent;
  eventService.createEvent({
    tank_id: `4`,
    timestamp: `1712110380000`,
    type: EVENT.WATER_COLUMN_FERTILIZED,
    update: tank4_update1712110380000,
    comments: undefined
  } as Event);

  const tank1_update1712507400000 = [
    { genus: `bacopa`, species: `caroliniana` } as TankInhabitant,
    { genus: `bucephalandra`, species: `pygmaea 'bukit kelam'` } as TankInhabitant,
    { genus: `hygrophila`, species: `corymbosa 'siamensis 53b'` } as TankInhabitant,
  ] as TankInhabitant[];
  eventService.createEvent({
    tank_id: `1`,
    timestamp: `1712507400000`,
    type: EVENT.PLANT_ADDED,
    update: tank1_update1712507400000,
    comments: undefined
  } as Event);
  const tank1_update1712508420000 = [
    { genus: `vittina`, species: `semiconica` } as TankInhabitant,
  ] as TankInhabitant[];
  eventService.createEvent({
    tank_id: `1`,
    timestamp: `1712508420000`,
    type: EVENT.LIVESTOCK_ADDED,
    update: tank1_update1712508420000,
    comments: undefined
  } as Event);

  const tank1_update1712695510000 = {
    name: `Seachem Flourish Potassium`,
    dose: 1.6,
    unit: DOSE_UNIT.MILLILITER
  } as RecentProductEvent;
  eventService.createEvent({
    tank_id: `1`,
    timestamp: `1712695510000`,
    type: EVENT.WATER_COLUMN_FERTILIZED,
    update: tank1_update1712695510000,
    comments: undefined
  });
  const tank2_update1712695513000 = {
    name: `Seachem Flourish Potassium`,
    dose: 0.75,
    unit: DOSE_UNIT.MILLILITER
  } as RecentProductEvent;
  eventService.createEvent({
    tank_id: `2`,
    timestamp: `1712695513000`,
    type: EVENT.WATER_COLUMN_FERTILIZED,
    update: tank2_update1712695513000,
    comments: undefined
  });
  const tank3_update1712695517000 = {
    name: `Seachem Flourish Potassium`,
    dose: 0.5,
    unit: DOSE_UNIT.MILLILITER
  } as RecentProductEvent;
  eventService.createEvent({
    tank_id: `3`,
    timestamp: `1712695517000`,
    type: EVENT.WATER_COLUMN_FERTILIZED,
    update: tank3_update1712695517000,
    comments: undefined
  });

  const tank1_update1712585544000 = {
    name: `Seachem Flourish Tabs`,
    dose: 3,
    unit: DOSE_UNIT.TABS
  } as RecentProductEvent;
  eventService.createEvent({
    tank_id: `1`,
    timestamp: `1712585544000`,
    type: EVENT.SUBSTRATE_FERTILIZED,
    update: tank1_update1712585544000,
    comments: undefined
  });
  const tank2_update1712695930000 = {
    name: `Seachem Flourish Tabs`,
    dose: 2,
    unit: DOSE_UNIT.TABS
  } as RecentProductEvent;
  eventService.createEvent({
    tank_id: `2`,
    timestamp: `1712695930000`,
    type: EVENT.SUBSTRATE_FERTILIZED,
    update: tank2_update1712695930000,
    comments: undefined
  });
  const tank3_update1712739072000 = {
    name: `Seachem Flourish Tabs`,
    dose: 2,
    unit: DOSE_UNIT.TABS
  } as RecentProductEvent;
  eventService.createEvent({
    tank_id: `3`,
    timestamp: `1712739072000`,
    type: EVENT.SUBSTRATE_FERTILIZED,
    update: tank3_update1712739072000,
    comments: undefined
  });
}