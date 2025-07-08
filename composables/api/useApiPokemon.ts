import { japanesePokemonNames } from "~/constants/names"
import type { Pokemons } from "@/types/responses/Pokemons"
import type { FilterKey, FilterValue } from "~/types/components/Pokemons"

export function useApiPokemon(){
  const nameMap = useState('japaneseNames', () => new Map<number, string>())

  function getStableRandomName(id: number): string {
    if (!nameMap.value.has(id)) {
      const index = Math.floor(Math.random() * japanesePokemonNames.length)
      nameMap.value.set(id, japanesePokemonNames[index])
    }

    return nameMap.value.get(id)!
  }


  const getPokemons = async (offset=0, limit=21, filter: Record<FilterKey, FilterValue>) => {
    return await $fetch(`/api/pokemons?offset=${offset}&limit=${limit}`, 
      { method: 'GET', query: filter }
    )
  }

  const getAll = async (offset=0, limit=21, filter: Record<FilterKey, FilterValue>) => {

    const apiUrl  = 'https://pokeapi.co/api/v2'
    const { data } = await getPokemons(offset, limit, filter)

    const pokemon = await Promise.all(
      data.map(name => $fetch(`${apiUrl}/pokemon/${name.name}`))
    ) as Pokemons[]

    for (const item of pokemon) {
      const formPokemon = data.find(p => p.id === item.id)
      item['form'] = formPokemon?.form || []
      item['title'] = formPokemon?.title || []

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
      delete item.sprites

      item.japanese_name = getStableRandomName(item.id)
    }

    return pokemon
  }
  

  return {
    getAll,
    getPokemons
  }
}
