import { types } from '@/constants/types'
import { pokemonTransform } from '@/utils/pokemonTransform';

function getTypeStats() {
  return types.map((typeObj) => {
    const typeId = typeObj.id;
    const typeName = typeObj.name;

    let singleCount = 0;
    let totalTypeCount = 0;

    for (const pokemon of pokemonTransform) {
      if (pokemon.type.includes(typeId)) {
        totalTypeCount++;
        if (pokemon.type.length === 1 && pokemon.type[0] === typeId) {
          singleCount++;
        }
      }
    }

    return {
      id: typeId,
      name: typeName,
      single_pokemon: singleCount,
      total_pokemon: totalTypeCount,
    };
  });
}

export default defineEventHandler(async (event) => {
  try {
    const response = getTypeStats()


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
