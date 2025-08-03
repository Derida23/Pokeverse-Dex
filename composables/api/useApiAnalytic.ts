type FilterKey = 'gen' | 'status' | 'order'

export function useApiAnalytic() {

  const getRank = async (filter: Record<FilterKey, string | number>) => {
    const { data } = await $fetch(`/api/analytics/rank`, {
      method: 'GET',
      query: filter
    })

    return { data }
  }

  const getAnalylic = async () => {
    const { data } = await $fetch(`/api/analytics/pokemon`, {
      method: 'GET',
    })

    return { data }
  }

  return {
    getRank,
    getAnalylic
  }
}
