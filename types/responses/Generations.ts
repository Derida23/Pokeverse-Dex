export interface Generations {
  abilities?: string[]
  id: number
  main_region: MainRegion
  moves?: string[]
  name: string
  names?: string[]
  pokemon_species: PokemonSpecy[]
  types?: string[]
  version_groups?: string[]
}

export interface MainRegion {
  name: string
  url: string
}

export interface PokemonSpecy {
  name: string
  url: string
}
