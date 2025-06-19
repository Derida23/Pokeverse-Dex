import { japanesePokemonNames } from "~/constants/name"
import type { PokemonsType } from "~/types/responses/PokemonsType"

export function useApiPokemon(){
  interface Pokemons {
    count: number
    next: string
    previous?: string
    results: Result[]
  }

  interface Result {
    name: string
    url: string
  }
  
  const nameMap = useState('japaneseNames', () => new Map<number, string>())

  function getStableRandomName(id: number): string {
  if (!nameMap.value.has(id)) {
    const index = Math.floor(Math.random() * japanesePokemonNames.length)
    nameMap.value.set(id, japanesePokemonNames[index])
  }
  return nameMap.value.get(id)!
}

  const getAll = async (offset=0, limit=21) => {
    const apiUrl  = 'https://pokeapi.co/api/v2'
    const data = await $fetch<Pokemons>(`${apiUrl}/pokemon?limit=${limit}&offset=${offset}`)
    const pokemons: string[] = data?.results?.map(item => item.name) || []

    const pokemon = await Promise.all(
      pokemons.map(name => $fetch(`${apiUrl}/pokemon/${name}`))
    ) as PokemonsType[]

    for (const item of pokemon) {
      delete item.abilities
      delete item.base_experience
      delete item.cries
      delete item.forms
      delete item.game_indices
      delete item.height
      delete item.held_items
      delete item.is_default
      delete item.location_area_encounters
      delete item.moves
      delete item.order
      delete item.past_abilities
      delete item.past_types
      delete item.species
      delete item.stats
      delete item.weight

      item.japanese_name = getStableRandomName(item.id)
    }

    console.log('Pokemons fetched:', pokemon)

    return pokemon
  }

  return {
    getAll
  }
}
