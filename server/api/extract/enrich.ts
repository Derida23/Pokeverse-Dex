import fs from 'fs/promises';
import fetch from 'node-fetch';

const getIdFromUrl = (url: string): number | null => {
  const match = url.match(/\/pokemon\/(\d+)\//);
  return match ? parseInt(match[1]) : null;
};

const getIdFromSpeciesUrl = (url: string): number | null => {
  const match = url.match(/\/pokemon-species\/(\d+)\//);
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
    .map((t: any) => parseInt(t.type.url.split('/').filter(Boolean).pop()));
};

export default defineEventHandler(async () => {
  const inputPath = 'server/data/pokemons.json';
  const enrichedOutput = 'public/enriched_pokemons.json';

  try {
    const raw = await fs.readFile(inputPath, 'utf8');
    const pokemons = JSON.parse(raw);

    const enriched = [];

    for (const { name, url } of pokemons) {
      try {
        const speciesId = getIdFromSpeciesUrl(url);
        if (!speciesId) continue;

        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${speciesId}`);
        const species = await speciesRes.json();

        const typeCombos: string[] = [];
        const formVariants: any[] = [];
        
        for (const variety of species.varieties) {
          const form_id = getIdFromUrl(variety.pokemon.url);
          const form_name = variety.pokemon.name;

          const typeIds = await getTypeIds(variety.pokemon.url);
          const key = JSON.stringify(typeIds);

          if (!typeCombos.includes(key)) {
            typeCombos.push(key);
          }

          // 🔍 Fetch species for each form (for Japanese name)
          let japanese_form_name = '';
          try {
            const formRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${form_id}`);
            const formData = await formRes.json();
            const speciesRes = await fetch(formData.species.url);
            const speciesData = await speciesRes.json();
            japanese_form_name = getJapaneseName(speciesData.names);
          } catch (err) {
            console.warn(`⚠️ Failed to get Japanese name for ${form_name}`);
          }

          if (!variety.is_default) {
            formVariants.push({
              form_id,
              form_name,
              japanese_name: japanese_form_name,
              types: typeIds
            });
          }
        }


        const types = typeCombos.map(key => JSON.parse(key));
        const generation_name = species.generation.name;
        const generation_id = parseInt(species.generation.url.split("/").filter(Boolean).pop() || "0");
        const japanese_name = getJapaneseName(species.names);

        const varietyNames = species.varieties.map((v: any) => v.pokemon.name);
        const is_mega = varietyNames.some(n => n.includes("mega"));
        const is_gmax = varietyNames.some(n => n.includes("gmax") || n.includes("gigantamax"));

        enriched.push({
          id: speciesId,
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
          },
          form_variants: formVariants
        });

        console.log(`✅ Processed ${name}`);
      } catch (err: any) {
        console.error(`❌ Failed to process ${name}: ${err.message}`);
      }
    }

    await fs.writeFile(enrichedOutput, JSON.stringify(enriched, null, 2));

    return {
      message: 'Success',
      total: enriched.length,
      file: '/enriched_pokemons.json'
    };
  } catch (err: any) {
    return {
      error: 'Failed to read or process input file',
      detail: err.message
    };
  }
});
