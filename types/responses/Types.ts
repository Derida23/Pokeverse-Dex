export interface Types {
  id: number
  name: string
  total_pokemon: number
  single_pokemon: number
}
export interface Type {
  id: number
  name: string
  pokemon: Pokemon[]
  offense: Offense
  defense: Defense
}

export interface Pokemon {
  pokemon: Pokemon2
  slot: number
}

export interface Pokemon2 {
  name: string
  url: string
}

export interface Offense {
  double_damage: DoubleDamage[]
  half_damage: HalfDamage[]
  no_damage: NoDamage[]
  single_damage: SingleDamage[]
}

export interface HalfDamage {
  name: string
  id: string
}

export interface NoDamage {
  name: string
  id: string
}

export interface SingleDamage {
  name: string
  id: string
}

export interface Defense {
  double_damage: DoubleDamage[]
  half_damage: DoubleDamage[]
  no_damage: NoDamage2[]
  single_damage: SingleDamage2[]
}

export interface DoubleDamage {
  name: string
  id: string
}

export interface NoDamage2 {
  name: string
  id: string
}

export interface SingleDamage2 {
  name: string
  id: string
}
