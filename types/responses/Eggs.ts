import type { Pokemons } from "./Pokemons"

export interface Eggs {
  id: number
  name: string
  names?: Name[]
  pokemon_species?: PokemonSpecy[]
  pokemons: Pokemons[]
}

export interface Name {
  language: Language
  name: string
}

export interface Language {
  name: string
  url: string
}

export interface PokemonSpecy {
  name: string
  url: string
}
