import type { Evolution } from "../responses/Evolution"
import type { Variants } from "../responses/Pokemons"

export interface PokemonDetail {
  detail: Detail
  evolution: Evolution
  text: string[]
  dex: Dex
  status: Status[]
  abilities: Ability[]
  breeding: Breeding
  type: Type
  form: Variants[]
}

export interface Detail {
  name: string
  id: number
  type: number[]
  height: number
  weight: number
  gender: Gender
  egg_cycle: number
}

export interface Gender {
  male: number
  female: number
  isGenderless: boolean
}

// export interface Evolution {
//   chain_id: number
//   evolves_to: EvolvesTo[]
// }

// export interface EvolvesTo {
//   detail: Detail2
//   evolves_to: EvolvesTo2[]
// }

// export interface Detail2 {
//   item: string
//   level: string
//   name: string
//   type: number[]
//   id: number
//   generation: number
// }

// export interface EvolvesTo2 {
//   detail: Detail3
//   evolves_to: EvolvesTo3[]
// }

// export interface Detail3 {
//   item: string
//   level: string
//   name: string
//   type: number[]
//   id: number
//   generation: number
// }

// export interface EvolvesTo3 {
//   detail: Detail4
//   evolves_to: EvolvesTo2[]
// }

// export interface Detail4 {
//   item: string
//   level: string
//   name: string
//   type: number[]
//   id: number
//   generation: number
// }

export interface Dex {
  generation: number
  habitat: string
  capture_rate: number
  growth_rate: string
  ev_yield: number
  base_experience: number
  base_happiness: number
}

export interface Status {
  base_stat: number
  effort: number
  name: string
}

export interface Ability {
  id: number
  name: string
  generation: number
  effect: string
  short_effect: string
  is_hidden: boolean
}

export interface Breeding {
  egg_groups: string[]
  egg_cycle: number
}

export interface Type {
  id: number[]
  defense: Defense
}

export interface Defense {
  no_damage: QuarterDamage[]
  quarter_damage: QuarterDamage[]
  half_damage: HalfDamage[]
  single_damage: SingleDamage[]
  double_damage: DoubleDamage[]
  fourth_damage: QuarterDamage[]
}

export interface QuarterDamage {
  name: string
  id: string
}

export interface HalfDamage {
  name: string
  id: string
}

export interface SingleDamage {
  name: string
  id: string
}

export interface DoubleDamage {
  name: string
  id: string
}
