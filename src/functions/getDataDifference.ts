import { Ailment, Parameter, TankInhabitant, TestSchedule } from "../interfaces/tankInterface";
import { checkObjectImagesEqual } from "./checkObjectEquality";

export const getAddedArrayOfPrimitivesItems = <T>(oldArray: T[], newArray: T[]): T[] => {
  const addedItems = newArray.filter(item => !oldArray.includes(item));
  return addedItems;
}

export const getRemovedArrayOfPrimitivesItems = <T>(oldArray: T[], newArray: T[]): T[] => {
  const addedItems = oldArray.filter(item => !newArray.includes(item));
  return addedItems;
}

/**
 * Designed to take array arguments based on length to avoid looping multiple times & easily spot differences
 *
 * @param sortedShortArray
 * @param sortedLongArray
 * @returns
 */
export const getArrayOfObjectsDifference = <T>(sortedShortArray: T[], sortedLongArray: T[]): T[] => {
  const diffArray: T[] = [];
  for (const [i, item] of sortedLongArray.entries()) {
    if (!checkObjectImagesEqual(sortedShortArray[i], item)) {
      diffArray.push(sortedLongArray[i]);
    }
  }
  return diffArray;
}

export const getAilmentsDifference = (shortArray: Ailment[], longArray: Ailment[]): Ailment[] => {
  const diffArray: Ailment[] = [];
  for (const ailment of longArray) {
    if (!shortArray.some(a => a.name === ailment.name)) {
      diffArray.push(ailment);
    }
  }
  return diffArray;
}

export const getTankInhabitantsDifference = (shortArray: TankInhabitant[], longArray: TankInhabitant[]): TankInhabitant[] => {
  const diffArray: TankInhabitant[] = [];
  for (const inhabitant of longArray) {
    if (!shortArray.some(i => i.genus === inhabitant.genus && i.species === inhabitant.species)) {
      diffArray.push(inhabitant);
    }
  }
  return diffArray;
}

export const getParameterDifference = (shortArray: Parameter[], longArray: Parameter[]): Parameter[] => {
  const diffArray: Parameter[] = [];
  for (const parameter of longArray) {
    if (!shortArray.some(p => p.parameter === parameter.parameter)) {
      diffArray.push(parameter);
    }
  }
  return diffArray;
}

export const getTestScheduleDifference = (shortArray: TestSchedule[], longArray: TestSchedule[]): TestSchedule[] => {
  const diffArray: TestSchedule[] = [];
  for (const test of longArray) {
    if (!shortArray.some(t => t.parameter === test.parameter)) {
      diffArray.push(test);
    }
  }
  return diffArray;
}