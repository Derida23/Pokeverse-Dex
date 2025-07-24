export type DamageCategory = 'no_damage' | 'half_damage' | 'single_damage' | 'double_damage';

export interface TypeData {
  name: string;
  id: string;
}

export interface TypeEffectiveness {
  no_damage: TypeData[];
  half_damage: TypeData[];
  single_damage: TypeData[];
  double_damage: TypeData[];
}

export type MultiplierGroup = '0x' | '0.25x' | '0.5x' | '1x' | '2x' | '4x';

export interface DamageResult extends TypeData {
  multiplier: number;
}

export type GroupedResultWithoutMultiplier = {
  [key in MultiplierGroup]: TypeData[];
};
