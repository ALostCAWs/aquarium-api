export interface PlantGenus {
  genus: string,
  species: string,
  type: string,
  feed_style: string,
  growth_rate: string,
  sensitivity: string[]
}

export interface PlantSpecies {
  genus: string,
  species: string,
  commonName: string,
  CO2: boolean,
  difficulty: string,
  light: string
}

export interface Plant {
  genus_info: PlantGenus,
  species_info: PlantSpecies
}