import type { ApiResponse } from "@/types/responses/ApiResponse"
import type { Pokemons } from "@/types/responses/Pokemons"

export function useApiVariation(){
  const getGigantamax = async () => {
    const { data } = await $fetch<ApiResponse<Pokemons[]>>('/api/forms/gigantamax', {
      method: 'GET'
    })
    
    return { data }
  }

  const getMega = async () => {
    const { data } = await $fetch<ApiResponse<Pokemons[]>>('/api/forms/mega', {
      method: 'GET'
    })
    
    return { data }
  }
  return {
    getGigantamax,
    getMega
  }
}
