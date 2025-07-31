<script setup lang="ts">
const props = defineProps({
  defense: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <PokemonDamage
    :damages="props.defense.fourth_damage"
    label="Takes 4× damage from"
    border-color="border-l-red-600"
    bg-color="bg-red-100/30"
  />

  <PokemonDamage
    :damages="defense.double_damage"
    label="Takes 2× damage from"
    border-color="border-l-red-600"
    bg-color="bg-red-100/30"
  />

  <PokemonDamage
    :damages="defense.single_damage"
    label="Takes 1× damage from"
  />

  <PokemonDamage
    :damages="defense.half_damage"
    label="Takes 1⁄2× damage from"
    border-color="border-l-green-600"
    bg-color="bg-green-100/30"
  />

  <PokemonDamage
    :damages="defense.quarter_damage"
    label="Takes 1⁄4× damage from"
    border-color="border-l-green-600"
    bg-color="bg-green-100/30"
  />
</template>
