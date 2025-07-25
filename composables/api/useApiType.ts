import type { ApiResponse } from "@/types/responses/ApiResponse"
import type { Type } from "@/types/responses/Type"

interface Types {
  id: number
  name: string
  total_pokemon: number
  single_pokemon: number
}

export function useApiType(){
  const getTypes = async () => {
    const { data } = await $fetch<ApiResponse<Types[]>>('/api/types', {
      method: 'GET'
    })

    return { data }
  }

  const getType = async (name: string) => {
    const { data } = await $fetch<ApiResponse<Type>>(`/api/types/${name}`, {
      method: 'GET'
    })

    return data

  }
  
  return {
    getTypes,
    getType
  }
}
