import { pokemons } from '@/constants/pokemons'
import { EXCLUDE_KEYWORDS } from '~/constants/names'
import { groupPokemonForms } from '~/utils/transform'

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

    // Apply filters
    const exFiltered = pokemons.filter(p =>
      !EXCLUDE_KEYWORDS.some(kw => p.name.includes(kw))
    )
    let filtered = groupPokemonForms(exFiltered)
    
    // if (query.gen) {
      // const pokemonGen = await $fetch(`/api/generation?id=${query.gen}`)
      // filtered = pokemonGen.data
      // filtered = filtered.filter(p => p.generation == query.gen)
    // }

    // if (query.type) {
    //   filtered = filtered.filter(p => p.types.includes(query.type as string))
    // }

    if (query.q) {
      const q = (query.q as string).toLowerCase()
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q))
    }

    // if (query.attr) {
    //   filtered = filtered.filter(p => p.attribute === query.attr)
    // }

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
