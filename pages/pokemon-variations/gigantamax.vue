<script setup lang="ts">

const { getGigantamax } = useApiVariation()
const { data: pokemons } = await getGigantamax()

</script>
<template>
  <div>
    <BaseTitle>Pokémon Gigantamax</BaseTitle>
    <CardList :pokemons="pokemons" :variants="'gmax'" />
  </div>
</template>
