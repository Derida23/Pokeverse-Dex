/* eslint-disable max-len */
 
import { analytics } from "~/constants/analytics";
import { types as typesMap } from "~/constants/types";
import { pokemons } from "~/constants/pokemons";
import type { Pokemons } from "~/types/responses/Pokemons";
import { pokemonTransform } from "~/utils/pokemonTransform";

type HeighestKey = 'is_legendary' | 'is_mythical' | 'is_regular'

const pokemonsData = pokemons.filter(a => analytics.some(p => p.id === a.id))
const analyticsData = analytics.filter(a => pokemons.some(p => p.id === a.id))

function isRegular(pokemon: Pokemons): boolean {
  const { is_legendary, is_mythical, is_mega, is_gmax } = pokemon.attr
  return !is_legendary && !is_mythical && !is_mega && !is_gmax
}

function getStrongestCategory(key: HeighestKey) {
  let filtered: Pokemons[]

  if (key === 'is_regular') {
    filtered = pokemonsData.filter(isRegular)
  } else {
    filtered = pokemonsData.filter(p => p.attr[key])
  }
  const matched = analyticsData.filter(a => filtered.some(p => p.id === a.id))

  const scored = matched.map(a => ({
    id: a.id,
    total: a.status.reduce((sum, s) => sum + s.base_stat, 0)
  }))

  const top = scored.sort((a, b) => b.total - a.total)[0]

  const fullData = analyticsData.find(a => a.id === top.id)

  return {
    ...fullData,
    total: top.total
  }
}

function getCategoryStats() {
  const total = pokemonsData.length

  const legendary = pokemonsData.filter(p => p.attr.is_legendary)
  const mythical = pokemonsData.filter(p => p.attr.is_mythical)

  return {
    total,
    legendary: {
      count: legendary.length,
      percent: ((legendary.length / total) * 100).toFixed(2) + '%'
    },
    mythical: {
      count: mythical.length,
      percent: ((mythical.length / total) * 100).toFixed(2) + '%'
    }
  }
}

function countTypes() {
  const result: Record<number, { type: string, single: number, dual: number }> = {}

  pokemonTransform.forEach(pokemon => {
    const types = pokemon.type

    types.forEach(typeId => {
      if (!result[typeId]) {
        result[typeId] = {
          type: typesMap.find((item) => item.id === typeId)?.name ?? '',
          single: 0,
          dual: 0
        }
      }

      if (types.length === 1) {
        result[typeId].single++
      } else {
        result[typeId].dual++
      }
    })
  })

  // Convert object → array
  return Object.values(result)
}

function countGeneration() {
  const result: Record<number, number> = {}

  for (const species of pokemons) {
    const gen = species.generation
    result[gen] = (result[gen] || 0) + 1
  }

  const sortedGens = Object.keys(result).map(Number).sort((a, b) => a - b)

  let cumulative = 0
  return sortedGens.map(gen => {
    const count = result[gen]
    cumulative += count
    return {
      generation: gen,
      count,
      total: cumulative
    }
  })
}


export default defineEventHandler(async (event) => {
  try {
    const totalPokemon = pokemonsData.length
    const totalPower = analyticsData.map(item => item.status.reduce((sum, s) => sum + s.base_stat, 0))
    const averagePower = totalPower.reduce((sum, s) => sum + s, 0) / totalPokemon

    const heighestLegend = getStrongestCategory('is_legendary')
    const heighestMythical = getStrongestCategory('is_mythical')
    const heighestRegular = getStrongestCategory('is_regular')

    const data = {
      total_pokemon: totalPokemon,
      average_power: Math.ceil(averagePower),
      heighest: {
        heighest_legend: heighestLegend,
        heighest_mythical: heighestMythical,
        heighest_regular: heighestRegular,
      },
      total_general: getCategoryStats(),
      types: countTypes(),
      generations: countGeneration()
    }

    return {
      success: true,
      message: 'Fetched successfully',
      data: data
    }
  } catch (error) {
    const err = error as { statusCode?: number; statusMessage?: string }
    return sendError(event, createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Internal Server Error',
    }))
  }
})
