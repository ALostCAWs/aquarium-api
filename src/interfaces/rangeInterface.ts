export interface TemperatureRange {
  min: number,
  max: number
}

interface ParameterRangeItem {
  min: number,
  max: number,
  unit: string
}
interface ParameterRequirementItem {
  min: number,
  unit: string
}
interface ParameterToleranceItem {
  max: number,
  unit: string
}
export interface ParameterRange {
  [parameter: string]: ParameterRangeItem | ParameterRequirementItem | ParameterToleranceItem
}
/*
let myParam: ParameterRange = {};

myParam['NH3'] = {
  min: 0,
  max: 0,
  unit: 'ppm'
};

let no3 = {
  max: 0,
  unit: 'ppm'
};

let no2 = {
  min: 0,
  unit: 'ppm'
};

myParam['NO3-'] = no3;
myParam['NO2-'] = no2;
*/