import type { Types } from "@/types/responses/Types"

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const type_id = query.id as string

    const { apiUrl } = useRuntimeConfig()
    const response: Types = await $fetch(`${apiUrl}/type/${type_id}`, {
      method: 'GET'
    })
    const pokemons = response.pokemon.map(item => item.pokemon)
    
    return {
      success: true,
      message: 'Fetched successfully',
      data: pokemons
    }
  } catch (error) {
    const err = error as { statusCode?: number; statusMessage?: string }
    return sendError(event, createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Internal Server Error',
    }))
  }
})
