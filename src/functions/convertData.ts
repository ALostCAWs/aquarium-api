import { TankInhabitant } from "../interfaces/tankInterface";

export const convertInhabitantsToArrayOfObjects = <T>(inhabitants: TankInhabitant[]): T[] => {
  const inhabitantsList = [];
  for (const name in inhabitants) {
    const genus = inhabitants[name]['genus'] as unknown as string;
    const species = inhabitants[name]['species'] as unknown as string;
    const inhabitant = {
      genus: genus,
      species: species
    } as T;
    inhabitantsList.push(inhabitant);
  }
  return inhabitantsList;
}