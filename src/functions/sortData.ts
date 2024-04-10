import { Ailment, Parameter, TankInhabitant, TestSchedule } from "../interfaces/tankInterface";

const returnSortNumber = <T>(a: T, b: T) => {
  if (a > b) {
    return 1;
  }
  else if (a < b) {
    return -1;
  }
  return 0;
}

export const sortInhabitantsArrayByGenusAndSpecies = (a: TankInhabitant, b: TankInhabitant) => {
  return returnSortNumber(`${a.genus}|${a.species}`, `${b.genus}|${b.species}`);
}

export const sortParametersArrayByParameter = (a: Parameter, b: Parameter) => {
  return returnSortNumber(a.parameter, b.parameter);
}

export const sortTestScheduleArrayByParameter = (a: TestSchedule, b: TestSchedule) => {
  return returnSortNumber(a.parameter, b.parameter);
}

export const sortAilmentArrayByName = (a: Ailment, b: Ailment) => {
  return returnSortNumber(a.name, b.name);
}