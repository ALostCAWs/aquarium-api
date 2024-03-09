import { ParameterRange, TemperatureRange } from "./rangeInterface"

export interface LivestockGenus {
  genus: string,
  species: string,
  type: string,
  feed_style: string,
  reproduction_style: string,
  temperature_range: TemperatureRange,
  parameters: ParameterRange,
  sensitivity: string[]
}

export interface LivestockSpecies {
  genus: string,
  species: string,
  common_name: string,
  difficulty: string
}