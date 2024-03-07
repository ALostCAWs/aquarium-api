interface Temperature_Range_Item {
  min: number,
  max: number
}
export interface Temperature_Range {
  celsius: Temperature_Range_Item,
  fahrenheit: Temperature_Range_Item
}

interface Parameter_Range_Item {
  min: number,
  max: number,
  unit: string
}
interface Parameter_Requirement_Item {
  min: number,
  unit: string
}
interface Parameter_Tolerance_Item {
  max: number,
  unit: string
}
export interface Parameter_Range {
  [parameter: string]: Parameter_Range_Item | Parameter_Requirement_Item | Parameter_Tolerance_Item
}
/*
let myParam: Parameter_Range = {};

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