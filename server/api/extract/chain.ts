// server/api/generate-chain.ts

import fs from 'node:fs/promises'
import fetch from 'node-fetch'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  const enrichedOutput = 'public/chain_pokemons.json'

  const fetchJson = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Fetch failed: ${url}`)
    return await res.json()
  }

  const getPokemonInfo = async (speciesUrl: string) => {
    const sp = await fetchJson(speciesUrl)
    const poke = await fetchJson(sp.varieties.find((v: any) => v.is_default).pokemon.url)

    const types = poke.types
      .sort((a: any, b: any) => a.slot - b.slot)
      .map((t: any) => parseInt(t.type.url.split('/').filter(Boolean).pop()))

    const generation = parseInt(sp.generation.url.split('/').filter(Boolean).pop())
    const id = parseInt(sp.id)

    return { types, generation, id }
  }

  const processChain = async (chainObj: any) => {
    const recurse = async (node: any): Promise<any> => {
      const { types, generation, id } = await getPokemonInfo(node.species.url)
      const evoDetail = node.evolution_details?.[0] || {}

      const detail = {
        item: evoDetail.item?.name || '',
        level: evoDetail.min_level || '',
        name: node.species.name,
        type: types,
        id,
        generation,
      }

      const evolves_to = await Promise.all(node.evolves_to.map((child: any) => recurse(child)))

      return { detail, evolves_to }
    }

    return [await recurse(chainObj.chain)]
  }

  const allChains = []
  const list = await fetchJson('https://pokeapi.co/api/v2/evolution-chain/?limit=100000')

  for (const item of list.results) {
    try {
      const id = parseInt(item.url.match(/\/evolution-chain\/(\d+)\//)?.[1] || '')
      if (!id) continue

      const chainObj = await fetchJson(item.url)
      const evolves_to = await processChain(chainObj)

      allChains.push({ chain_id: id, evolves_to })
      console.log(`✅ Processed chain ${id}`)
    } catch (err: any) {
      console.warn(`⚠️ Skipped: ${item.url} - ${err.message}`)
    }
  }

  await fs.mkdir('public', { recursive: true })
  await fs.writeFile(enrichedOutput, JSON.stringify(allChains, null, 2))

  return {
    status: 'success',
    message: `Saved ${allChains.length} chains to ${enrichedOutput}`,
  }
})
