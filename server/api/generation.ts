import type { Generations } from "~/types/api/Generations"

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const generation_id = query.id as string

    const { apiUrl } = useRuntimeConfig()
    const response:Generations = await $fetch(`${apiUrl}/generation/${generation_id}`, {
      method: 'GET'
    })

    const pokemons = [...response.pokemon_species]


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
