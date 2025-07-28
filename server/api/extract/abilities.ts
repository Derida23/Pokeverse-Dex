// server/api/generate-abilities.ts

import fs from 'node:fs/promises'
import fetch from 'node-fetch'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  const outputPath = 'public/abilities.json'

  const fetchJson = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to fetch: ${url}`)
    return await res.json()
  }

  const abilityList = await fetchJson('https://pokeapi.co/api/v2/ability?limit=10000')

  const abilities = []
  for (const item of abilityList.results) {
    try {
      const data = await fetchJson(item.url)

      const id = data.id
      const name = data.name
      const generation = parseInt(data.generation.url.split('/').filter(Boolean).pop())

      const effect_entry = data.effect_entries.find((entry: any) => entry.language.name === 'en')

      abilities.push({
        id,
        name,
        generation,
        effect: effect_entry?.effect || '',
        short_effect: effect_entry?.short_effect || ''
      })

      console.log(`✅ Fetched ability: ${name}`)
    } catch (err: any) {
      console.warn(`⚠️ Skipped ability ${item.name}: ${err.message}`)
    }
  }

  await fs.mkdir('public', { recursive: true })
  await fs.writeFile(outputPath, JSON.stringify(abilities, null, 2))

  return {
    status: 'success',
    count: abilities.length,
    output: outputPath
  }
})
