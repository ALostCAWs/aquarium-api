import { Parameter_Range, Temperature_Range } from "./rangeInterface"

export interface LivestockGenus {
  genus: string,
  species: string,
  type: string,
  feed_style: string,
  reproduction_style: string,
  temperature_range: Temperature_Range,
  parameters: Parameter_Range,
  sensitivity: string[]
}

export interface LivestockSpecies {
  genus: string,
  species: string,
  common_name: string,
  temperature_range: string,
  difficulty: string
}