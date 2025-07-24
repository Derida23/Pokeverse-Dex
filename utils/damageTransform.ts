import type {
   DamageCategory, 
   DamageResult, 
   GroupedResultWithoutMultiplier, 
   MultiplierGroup, 
   TypeData, 
   TypeEffectiveness 
  } from '@/types/components/DamageTypes'

const multiplierMap: Record<DamageCategory, number> = {
  no_damage: 0,
  half_damage: 0.5,
  single_damage: 1,
  double_damage: 2
};

function getMultiplier(data: TypeEffectiveness, id: string): number {
  for (const key in multiplierMap) {
    const category = key as DamageCategory;
    if (data[category].some((t) => t.id === id)) {
      return multiplierMap[category];
    }
  }
  return 1; // default to single damage if not found
}

export function calculateDefense(
  type1: TypeEffectiveness,
  type2: TypeEffectiveness
): Record<string, DamageResult> {
  const allTypes = [
    ...type1.no_damage,
    ...type1.half_damage,
    ...type1.single_damage,
    ...type1.double_damage,
    ...type2.no_damage,
    ...type2.half_damage,
    ...type2.single_damage,
    ...type2.double_damage
  ];

  const typeMap = new Map<string, TypeData>();
  for (const t of allTypes) {
    typeMap.set(t.id, t);
  }

  const result: Record<string, DamageResult> = {};

  for (const [id, type] of typeMap.entries()) {
    const m1 = getMultiplier(type1, id);
    const m2 = getMultiplier(type2, id);
    const total = m1 * m2;

    result[id] = {
      name: type.name,
      id: type.id,
      multiplier: total
    };
  }

  return result;
}

export function groupByEffectiveness(
  defenseMap: Record<string, DamageResult>
): GroupedResultWithoutMultiplier {
  const groups: GroupedResultWithoutMultiplier = {
    '0x': [],
    '0.25x': [],
    '0.5x': [],
    '1x': [],
    '2x': [],
    '4x': []
  };

  Object.values(defenseMap).forEach(({ name, id, multiplier }) => {
    const label: MultiplierGroup | null =
      multiplier === 0 ? '0x' :
      multiplier === 0.25 ? '0.25x' :
      multiplier === 0.5 ? '0.5x' :
      multiplier === 1 ? '1x' :
      multiplier === 2 ? '2x' :
      multiplier === 4 ? '4x' :
      null;

    if (label) {
      groups[label].push({ name, id });
    }
  });

  return groups;
}
