<script setup lang="ts">
const { getMega } = useApiVariation()

const { data:pokemons } = await getMega()


</script>
<template>
  <div>
    <BaseTitle>Pokémon Mega Forms</BaseTitle>
    <CardList :pokemons="pokemons" />
  </div>
</template>
