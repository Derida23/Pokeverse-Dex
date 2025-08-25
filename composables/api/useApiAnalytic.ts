import type { ApiResponse } from "~/types/api/ApiResponse"
import type { Analytics } from "~/types/responses/Analytics"
import type { Ranks } from "~/types/responses/Ranks"

type FilterKey = 'gen' | 'status' | 'order'

export function useApiAnalytic() {

  const getRank = async (filter: Record<FilterKey, string | number>) => {
    const { data } = await $fetch<ApiResponse<Ranks[]>>(`/api/analytics/rank`, {
      method: 'GET',
      query: filter
    })

    return { data }
  }

  const getAnalytic = async () => {
    const { data } = await $fetch<ApiResponse<Analytics>>(`/api/analytics/pokemon`, {
      method: 'GET',
    })

    return { data }
  }

  return {
    getRank,
    getAnalytic
  }
}
