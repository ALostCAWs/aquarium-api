export const validateString = (inputString: string) => {
  if (inputString === null || inputString === undefined || inputString === '') {
    return false;
  }
  return true;
}

export const validateTimestamp = (inputTimestamp: string) => {
  return new Date(inputTimestamp).getTime() > 0;
}

export const validateEnumValues = (value: string, enumName: any) => {
  const enumValues = Object.values(enumName) as string[];
  return enumValues.includes(value);
}