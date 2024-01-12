export interface LivestockGenus {
  genus: string,
  species: string,
  type: string,
  feed_style: string,
  reproduction_style: string,
  sensitivity: string[]
}

export interface LivestockSpecies {
  genus: string,
  species: string,
  commonName: string,
  temperature_range: string,
  difficulty: string
}