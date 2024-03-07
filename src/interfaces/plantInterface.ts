import { Temperature_Range, Parameter_Range } from "./rangeInterface"

export interface PlantGenus {
  genus: string,
  species: string,
  type: string,
  feed_style: string,
  growth_rate: string,
  temperature_range: Temperature_Range,
  parameters: Parameter_Range,
  sensitivity: string[]
}

export interface PlantSpecies {
  genus: string,
  species: string,
  common_name: string,
  CO2: boolean,
  difficulty: string,
  light: string
}

export interface Plant {
  genus_info: PlantGenus,
  species_info: PlantSpecies
}