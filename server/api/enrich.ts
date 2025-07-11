import fs from 'fs/promises';
import fetch from 'node-fetch';

const getIdFromUrl = (url: string): number | null => {
  const match = url.match(/\/pokemon\/(\d+)\//);
  return match ? parseInt(match[1]) : null;
};

const getJapaneseName = (names: any[]): string => {
  const entry = names.find(n => n.language.name === 'ja-Hrkt');
  return entry ? entry.name : '';
};

const getTypeIds = async (url: string): Promise<number[]> => {
  const res = await fetch(url);
  const data = await res.json();
  return data.types
    .sort((a: any, b: any) => a.slot - b.slot)
    .map((t: any) => t.type.url.split('/').filter(Boolean).pop())
    .map(Number);
};

export default defineEventHandler(async () => {
  const inputPath = 'server/data/pokemons.json';
  const outputPath = 'public/enriched_pokemons.json';

  try {
    const json = await fs.readFile(inputPath, 'utf8');
    const pokemons = JSON.parse(json);
    const enriched = [];

    for (const { name, url } of pokemons) {
      try {
        const speciesId = url.match(/\/pokemon-species\/(\d+)\//)?.[1];
        if (!speciesId) continue;

        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${speciesId}/`);
        const species = await speciesRes.json();

        // Get all type combinations from varieties
        const typeCombos: string[] = [];

        for (const variety of species.varieties) {
          const typeIds = await getTypeIds(variety.pokemon.url);
          const key = JSON.stringify(typeIds); // to deduplicate
          if (!typeCombos.includes(key)) {
            typeCombos.push(key);
          }
        }

        const types = typeCombos.map(c => JSON.parse(c));

        const generation_name = species.generation.name;
        const generation_id = parseInt(species.generation.url.split("/").filter(Boolean).pop() || "0");

        const varietyNames = species.varieties.map((v: any) => v.pokemon.name);
        const is_mega = varietyNames.some(n => n.includes("mega"));
        const is_gmax = varietyNames.some(n => n.includes("gmax") || n.includes("gigantamax"));
        const japanese_name = getJapaneseName(species.names);

        enriched.push({
          id: parseInt(speciesId),
          name,
          japanese_name,
          types,
          forms: species.varieties.length,
          generation: generation_id,
          attr: {
            is_legendary: species.is_legendary,
            is_mythical: species.is_mythical,
            is_mega,
            is_gmax,
            is_baby: species.is_baby
          }
        });

        console.log(`✅ ${name}`);
      } catch (err: any) {
        console.error(`❌ Failed for ${name}:`, err.message);
      }
    }

    await fs.writeFile(outputPath, JSON.stringify(enriched, null, 2));
    return {
      message: 'Success',
      total: enriched.length,
      file: '/enriched_pokemons.json'
    };
  } catch (err: any) {
    return { error: 'Failed to read or parse JSON', detail: err.message };
  }
});
