export interface Ranks {
  id: number
  name: string
  types: number[]
  height: number
  weight: number
  base_experience: number
  generation: number
  status: Status[]
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
