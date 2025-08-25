export interface Analytics {
  total_pokemon: number
  average_power: number
  heighest: Heighest
  total_general: TotalGeneral
  types: Type[]
  generations: Generation[]
}

export interface Heighest {
  heighest_legend: HeighestLegend
  heighest_mythical: HeighestMythical
  heighest_regular: HeighestRegular
}

export interface HeighestLegend {
  id: number
  name: string
  types: number[]
  height: number
  weight: number
  base_experience: number
  generation: number
  status: Status[]
  total: number
}

export interface Status {
  base_stat: number
  effort: number
  stat: Stat
}

export interface Stat {
  name: string
  url: string
}

export interface HeighestMythical {
  id: number
  name: string
  types: number[]
  height: number
  weight: number
  base_experience: number
  generation: number
  status: Status2[]
  total: number
}

export interface Status2 {
  base_stat: number
  effort: number
  stat: Stat2
}

export interface Stat2 {
  name: string
  url: string
}

export interface HeighestRegular {
  id: number
  name: string
  types: number[]
  height: number
  weight: number
  base_experience: number
  generation: number
  status: Status3[]
  total: number
}

export interface Status3 {
  base_stat: number
  effort: number
  stat: Stat3
}

export interface Stat3 {
  name: string
  url: string
}

export interface TotalGeneral {
  total: number
  legendary: Legendary
  mythical: Mythical
}

export interface Legendary {
  count: number
  percent: string
}

export interface Mythical {
  count: number
  percent: string
}

export interface Type {
  type: string
  single: number
  dual: number
}

export interface Generation {
  generation: number
  count: number
  total: number
}
