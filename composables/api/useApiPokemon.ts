import type { FilterKey, FilterValue } from "@/types/components/Pokemons"
import type { ApiResponse } from "~/types/api/ApiResponse"
import type { Pokemons } from "@/types/responses/Pokemons"
import type { PokemonDetail } from "~/types/api/PokemonDetail"
import type { PokemonId } from "~/types/api/Pokemons"

export function useApiPokemon(){
  const getPokemons = async (offset=0, limit=21, filter: Record<FilterKey, FilterValue>)
  : Promise<ApiResponse<Pokemons[]>> => {
    return await $fetch(`/api/pokemons?offset=${offset}&limit=${limit}`, 
      { method: 'GET', query: filter }
    )
  }

  const getAll = async (offset=0, limit=21, filter: Record<FilterKey, FilterValue>) => {
    const { data, pagination } = await getPokemons(offset, limit, filter)
    return { data, pagination }
  }

  const getPokemon = async (pokemon: string, form?: string) => {
    return await $fetch<ApiResponse<PokemonDetail>>(`/api/pokemons/${pokemon}`, 
      { method: 'GET', query: { form } }
    )
  }

  const getCompare = async (offset=0, limit=21, filter: Record<'q', string>)
  : Promise<ApiResponse<PokemonId[]>> => {
    return await $fetch(`/api/pokemon-variants?offset=${offset}&limit=${limit}`, 
      { method: 'GET', query: filter }
    )
  }

  return {
    getAll,
    getPokemons,
    getPokemon,
    getCompare
  }
}
