import type { GenderRatio } from "~/types/api/Pokemons";
import type { FlavorTextEntry } from "~/types/api/PokemonSpecies";
import { types } from "~/constants/types";
import type { Type } from "~/types/responses/Types";
import { calculateDefense, groupByEffectiveness } from "~/utils/damageTransform";

export function calculateGenderRatio(genderRate: number): GenderRatio {
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

export function getUniqueFlavorTexts(entries: FlavorTextEntry[]) {
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

export function getType (id: number) {
  return id ? types.find((item) => item.id === id)?.name : null
}

export function handleDefense (main: Type, pair: Type) {
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
