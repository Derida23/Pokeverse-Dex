import type { ApiResponse } from "~/types/api/ApiResponse"
import type { Eggs } from "~/types/responses/Eggs"

interface EggsList {
  id: number
  name: string
}

export function useApiEgg(){
  const getEggs = async () => {
    const { data } = await $fetch<ApiResponse<EggsList[]>>('/api/eggs', {
      method: 'GET'
    })

    return { data }
  }

  const getEgg = async (name: string) => {
    const { data } = await $fetch<ApiResponse<Eggs>>(`/api/eggs/${name}`, {
      method: 'GET'
    })

    return { data }
  }

  return {
    getEggs,
    getEgg
  }
}
