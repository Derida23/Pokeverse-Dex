import type { FilterEvo, FilterValue } from "@/types/components/Pokemons"
import type { ApiResponse } from "@/types/responses/ApiResponse"
import type { Evolution } from "~/types/responses/Evolution"

export function useApiEvolution(){
  const getEvolution = async (offset=0, limit=21, filter: Record<FilterEvo, FilterValue>)
  : Promise<ApiResponse<Evolution[]>> => {
    return await $fetch(`/api/evolution?offset=${offset}&limit=${limit}`, 
      { method: 'GET', query: filter }
    )
  }

  return {
    getEvolution
  }
}
