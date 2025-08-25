/* eslint-disable max-len */
import { analytics } from "~/constants/analytics";
import { pokemons } from "~/constants/pokemons";
import type { Ranks } from "~/types/responses/Ranks";

function sortByStat(pokemons: Ranks[], statName: string, desc: string = 'asc') {
  const getStat = (pokemon: Ranks) =>
    pokemon.status.find((item) => item.stat.name === statName)?.base_stat ?? 0

  return pokemons.sort((a, b) => {
    const aStat = getStat(a)
    const bStat = getStat(b)
    return desc === 'asc' ? bStat - aStat : aStat - bStat
  })
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const status = query.status || 'attack'
  const generation = query.gen || 0
  const order = query.order || 'asc'
  
  try {
    const analyticsData = analytics.filter(a => pokemons.some(p => p.id === a.id))

    const sorted = sortByStat(analyticsData, status.toString(), order.toString())
    const pokemonRank = (!generation || generation == 0 ) ? sorted : sorted.filter((item) => item.generation === Number(generation))

    const response = pokemonRank.splice(0, 3)

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
