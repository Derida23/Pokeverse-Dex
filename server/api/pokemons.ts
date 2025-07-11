import { pokemons } from '@/constants/pokemons'
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

    let filtered = [...pokemons]

    if (query.gen) {
      const gen = Number(query.gen)
      filtered = filtered.filter(p => p.generation === gen)
    }

    if (query.type) {
      const type = types.find(t => t.name === query.type)?.id

      filtered = filtered.filter(pokemon =>
        pokemon.types.some(typeGroup =>
          typeGroup.includes(Number(type))
        )
      )
    }

    if (query.q) {
      const q = (query.q as string).toLowerCase()
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q))
    }

    if (query.attr) {
      const attrs = query.attr.toString().split('.')

      filtered = filtered.filter(pokemon =>
        attrs.some(key => pokemon.attr?.[key as keyof typeof pokemon.attr])
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
