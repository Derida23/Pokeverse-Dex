
import type { Eggs } from '@/types/responses/Eggs';
import { eggs } from "@/constants/egg-groups";
import { getID } from '@/utils/textTransform';
import { pokemons } from "@/constants/pokemons"

export default defineEventHandler(async (event) => {
  try {
    const type = event.context.params?.type;
    const typeId = eggs.find((item) => item.name === type) as { name: string, id: number }

    const { apiUrl } = useRuntimeConfig()
    const response = await $fetch<Eggs>(`${apiUrl}/egg-group/${typeId.id}`, {
      method: 'GET'
    })

    delete response['names']

    if(response.pokemon_species) {
      const ids = response.pokemon_species.map(item => getID(item.url))
      const filtered = pokemons.filter(pokemon => ids.includes(pokemon.id.toString()));
  
      response['pokemons'] = filtered
      delete response['pokemon_species']
    }

    return {
      success: true,
      message: 'Fetched successfully',
      data: response
    }
  } catch (error) {
    const err = error as { statusCode?: number; statusMessage?: string }
    return sendError(event, createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Internal Server Error',
    }))
  }
})
