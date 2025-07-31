import { pokemonTransform } from '~/utils/pokemonTransform'

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

    let filtered = [...pokemonTransform]


    if (query.q) {
      const q = (query.q as string).toLowerCase()
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q))
    }

    const results = filtered.slice(offset, offset + limit)

    return {
      success: true,
      message: 'Fetched successfully',
      data: results,
    }
  } catch (error) {
    const err = error as { statusCode?: number; statusMessage?: string }
    return sendError(event, createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Internal Server Error',
    }))
  }
})
