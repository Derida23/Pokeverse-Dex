/* eslint-disable max-len */
import { abilities } from "~/constants/abilities";
import { chain_pokemons } from "~/constants/chain_pokemons";
import { types } from "~/constants/types";
import type { GenderRatio, PokemonId, Pokemons, Abilities } from "~/types/api/Pokemons";
import type { PokemonSpecies, FlavorTextEntry } from "~/types/api/PokemonSpecies";
import type { Type } from "~/types/responses/Types";
import { calculateDefense, groupByEffectiveness } from "~/utils/damageTransform";
import { pokemonTransform } from "~/utils/pokemonTransform";
import { getID } from "~/utils/textTransform";

function calculateGenderRatio(genderRate: number): GenderRatio {
  if (genderRate === -1) {
    return {
      male: 0,
      female: 0,
      isGenderless: true,
    };
  }

  const female = (genderRate / 8) * 10;
  const male = 10 - female;

  return {
    male: Math.floor(male),
    female: Math.floor(female),
    isGenderless: false,
  };
}

function getUniqueFlavorTexts(entries: FlavorTextEntry[]) {
  const seen = new Set();
  const uniqueTexts = [];

  for (const entry of entries) {
    if (entry.language.name !== "en") continue;

    const cleanedText = entry.flavor_text.replace(/\s+/g, " ").trim();

    if (!seen.has(cleanedText)) {
      seen.add(cleanedText);
      uniqueTexts.push(cleanedText.toLowerCase());
    }
  }

  return uniqueTexts.splice(0, 5);
}

const getType = (id: number) => {
  return id ? types.find((item) => item.id === id)?.name : null
}

function handleDefense (main: Type, pair: Type) {
  const defensed = calculateDefense(main.defense, pair.defense);
  const grouped = groupByEffectiveness(defensed);
  
  const normalize = {
    no_damage: grouped['0x'],
    quarter_damage: grouped['0.25x'],
    half_damage: grouped['0.5x'],
    single_damage: grouped['1x'],
    double_damage: grouped['2x'],
    fourth_damage: grouped['4x'],
  }
  
  return normalize
}


export default defineEventHandler(async (event) => {
  try {
    const params = event.context.params?.pokemon;
    const pokemonId = pokemonTransform.find((item) => item.name === params) as PokemonId
    
    const { apiUrl } = useRuntimeConfig()
    const resPokemon = await $fetch<Pokemons>(`${apiUrl}/pokemon/${pokemonId.id}`, {
      method: 'GET'
    })

    const resSpecies = await $fetch<PokemonSpecies>(`${apiUrl}/pokemon-species/${pokemonId.id}`, {
      method: 'GET'
    })

    const evolution= chain_pokemons.find((item) => item.chain_id === Number(getID(resSpecies.evolution_chain.url)))
    const text = getUniqueFlavorTexts(resSpecies.flavor_text_entries)
    const specialAttack = resPokemon.stats.find((item) => item.stat.name === 'special-attack')
    const status = resPokemon.stats.map(item => { 
      return {
        base_stat: item.base_stat,
        effort: item.effort,
        name: item.stat.name
      }
    })

    const abilitiesPokemon: Abilities[] = []

    resPokemon.abilities.forEach((item) => {
      const abies = abilities.find((abb) => abb.id === Number(getID(item.ability.url))) as Abilities
      abilitiesPokemon.push({...abies, is_hidden: item.is_hidden})
    })

    const [mainType, pairType] = pokemonId.type.map(getType)
    const [main, pair] = await Promise.all([
      $fetch(`/api/types/${mainType}`),
      pairType ? $fetch(`/api/types/${pairType}`) : null
    ])

    const defense = !pair ? main.data.defense : handleDefense(main.data, pair?.data ?? null)

    const pokemon = {
      detail: {
        name: pokemonId.name,
        id: pokemonId.id,
        type: pokemonId.type,
        height: resPokemon.height,
        weight: resPokemon.weight,
        gender: calculateGenderRatio(resSpecies.gender_rate),
        egg_cycle: resSpecies.hatch_counter
      },
      evolution,
      text,
      dex: {
        generation: pokemonId.generation,
        habitat: resSpecies.habitat.name,
        capture_rate: resSpecies.capture_rate,
        growth_rate: resSpecies.growth_rate.name,
        ev_yield: specialAttack?.effort ?? 0,
        base_experience: resPokemon.base_experience,
        base_happiness: resSpecies.base_happiness
      },
      status,
      abilities: abilitiesPokemon,
      breeding: {
        egg_groups: resSpecies.egg_groups.map((item) => item.name),
        egg_cycle: resSpecies.hatch_counter
      },
      type: {
        id: pokemonId.type,
        defense: defense
      }
    }

    return {
      success: true,
      message: 'Fetched successfully',
      data: pokemon
    }
  } catch (error) {
    const err = error as { statusCode?: number; statusMessage?: string }
    return sendError(event, createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Internal Server Error',
    }))
  }
})
