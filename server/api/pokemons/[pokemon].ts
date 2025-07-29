/* eslint-disable max-len */
import { abilities } from "~/constants/abilities";
import { chain_pokemons } from "~/constants/chain_pokemons";
import { pokemons } from "~/constants/pokemons";
import type { PokemonId, Pokemons, Abilities } from "~/types/api/Pokemons";
import type { PokemonSpecies } from "~/types/api/PokemonSpecies";
import type { Pokemons as PokemonForm, Variants } from "~/types/responses/Pokemons";
import { calculateGenderRatio, getType, getUniqueFlavorTexts, handleDefense } from "~/utils/pokemonApi";
import { pokemonTransform } from "~/utils/pokemonTransform";
import { getID } from "~/utils/textTransform";

export default defineEventHandler(async (event) => {
  try {
    const { form } = getQuery(event)
    const params = event.context.params?.pokemon;
    const pokemonId = pokemonTransform.find((item) => item.name === params) as PokemonId
    let pokemonFormId: PokemonId = pokemonId

    if (form) {
      pokemonFormId = pokemonTransform.find((item) => item.name === form) as PokemonId
    } 

    const { apiUrl } = useRuntimeConfig()
    const resPokemon = await $fetch<Pokemons>(`${apiUrl}/pokemon/${pokemonFormId.id}`, {
      method: 'GET'
    })

    const resSpecies = await $fetch<PokemonSpecies>(`${apiUrl}/pokemon-species/${pokemonId.id}`, {
      method: 'GET'
    })

    const evolution= chain_pokemons.find((item) => item.chain_id === Number(getID(resSpecies.evolution_chain.url)))
    const text = getUniqueFlavorTexts(resSpecies.flavor_text_entries)
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

    const [mainType, pairType] = pokemonFormId.type.map(getType)
    const [main, pair] = await Promise.all([
      $fetch(`/api/types/${mainType}`),
      pairType ? $fetch(`/api/types/${pairType}`) : null
    ])

    const defense = !pair ? main.data.defense : handleDefense(main.data, pair?.data ?? null)

    const formPokemons = pokemons.find((item) => item.id === pokemonId.id) as PokemonForm
    let forms = [] as Variants[]

    if (formPokemons.form_variants) {
        const dataForms = [{
            form_id: formPokemons.id,
            form_name: formPokemons.name,
            japanese_name: formPokemons.japanese_name,
            types: formPokemons.types[0]
          },
          ...formPokemons.form_variants
        ]

        forms = dataForms
    }

    const pokemon = {
      detail: {
        name: pokemonFormId.name,
        id: pokemonFormId.id,
        type: pokemonFormId.type,
        height: resPokemon.height,
        weight: resPokemon.weight,
        gender: calculateGenderRatio(resSpecies.gender_rate),
        egg_cycle: resSpecies.hatch_counter
      },
      evolution,
      text,
      dex: {
        generation: pokemonFormId.generation,
        habitat: resSpecies.habitat?.name ?? 'N/A',
        capture_rate: resSpecies.capture_rate,
        growth_rate: resSpecies.growth_rate.name,
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
        id: pokemonFormId.type,
        defense: defense
      },
      form: forms
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
