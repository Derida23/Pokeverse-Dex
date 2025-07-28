export interface Evolution {
  chain_id: number
  evolves_to: EvolvesTo[]
}

export interface EvolvesTo {
  detail: Detail
  evolves_to: EvolvesTo2[]
}

export interface Detail {
  item: string
  level: number | string
  name: string
  type: number[]
  id: number
  generation: number
}

export interface EvolvesTo2 {
  detail: Detail
  evolves_to: EvolvesTo3[]
}

export interface EvolvesTo3 {
  detail: Detail
  evolves_to: [] | EvolvesTo2[]
}
