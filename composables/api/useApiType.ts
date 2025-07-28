import type { ApiResponse } from "~/types/api/ApiResponse"
import type { Types, Type } from "~/types/responses/Types"

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
