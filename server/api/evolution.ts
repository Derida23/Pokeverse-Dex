import { chain_pokemons } from '@/constants/chain_pokemons'
import { types } from '~/constants/types'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const limit = parseInt(query.limit as string) || 21
    const offset = parseInt(query.offset as string) || 0

    if (limit < 0 || offset < 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Limit and offset must be non-negative',
      })
    }

    const pokemons = chain_pokemons.filter((item) => item.evolves_to[0].evolves_to.length > 0)

    let filtered = [...pokemons]
    

    if (query.gen) {
      const gen = Number(query.gen)
      filtered = filtered.filter(p => p.evolves_to[0].detail.generation === gen)
    }

    if (query.type) {
      const type = types.find(t => t.name === query.type)?.id

      filtered = filtered.filter(pokemon =>
        pokemon.evolves_to.some(typeGroup =>
          typeGroup.detail.type.includes(Number(type))
        )
      )
    }

    const results = filtered.slice(offset, offset + limit)

    return {
      success: true,
      message: 'Fetched successfully',
      data: results,
      pagination: {
        total: filtered.length,
        limit: limit,
        offset: offset,
        hasMore: offset + limit < filtered.length,
      }
    }
  } catch (error) {
    const err = error as { statusCode?: number; statusMessage?: string }
    return sendError(event, createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Internal Server Error',
    }))
  }
})
