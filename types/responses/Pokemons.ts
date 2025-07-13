export interface Pokemons {
  id: number
  name: string
  japanese_name: string
  types: number[][]
  forms: number
  generation: number
  attr: Attr
  form_variants: Variants[] | []
}

export interface Attr {
  is_legendary: boolean
  is_mythical: boolean
  is_mega: boolean
  is_gmax: boolean
  is_baby: boolean
}

export interface Variants {
  form_id: number
  form_name: string
  types: number[]
  japanese_name: string
}
