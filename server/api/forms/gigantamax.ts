import { pokemons } from '@/constants/pokemons'

export default defineEventHandler(async (event) => {
  try {
    const gigaForm = pokemons
    .filter(pokemon => pokemon.attr.is_gmax)
    .flatMap(pokemon =>
      pokemon.form_variants
        .filter(variant => variant.form_name.includes('gmax'))
        .map(variant => ({
          id: variant.form_id,
          name: variant.form_name,
          japanese_name: variant.japanese_name,
          types: [variant.types],
          forms: 1,
          generation: 1,
          attr: {
            is_legendary: false,
            is_mythical: false,
            is_mega: false,
            is_gmax: true,
            is_baby: false
          },
          form_variants: []
        }))
    )


    return {
      success: true,
      message: 'Fetched successfully',
      data: gigaForm,
      pagination: {
        total: gigaForm.length,
        limit: null,
        offset: null,
        hasMore: false,
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
