// server/api/generate-pokemons.ts

import fs from 'node:fs/promises'
import fetch from 'node-fetch'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  const outputPath = 'public/pokemons.json'

  const fetchJson = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
    return await res.json()
  }

  const allPokemonList = await fetchJson('https://pokeapi.co/api/v2/pokemon?limit=100000')

  const results = []

  for (const item of allPokemonList.results) {
    try {
      const pokemon = await fetchJson(item.url)
      const species = await fetchJson(pokemon.species.url)

      const id = pokemon.id
      const name = pokemon.name
      const height = pokemon.height
      const weight = pokemon.weight
      const base_experience = pokemon.base_experience
      const status = pokemon.stats

      const types = pokemon.types.map((t: any) =>
        parseInt(t.type.url.split('/').filter(Boolean).pop())
      )

      const generation = parseInt(species.generation.url.split('/').filter(Boolean).pop())

      results.push({
        id,
        name,
        types,
        height,
        weight,
        base_experience,
        generation,
        status
      })

      console.log(`✅ ${id} ${name}`)
    } catch (err: any) {
      console.warn(`⚠️ Skipped ${item.name}: ${err.message}`)
    }
  }

  await fs.mkdir('public', { recursive: true })
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2))

  return {
    status: 'success',
    count: results.length,
    output: outputPath,
  }
})
