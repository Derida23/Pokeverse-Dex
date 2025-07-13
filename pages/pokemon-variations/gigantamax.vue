<script setup lang="ts">

const { getGigantamax } = useApiVariation()
const { data: pokemons } = await getGigantamax()

</script>
<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold">Pokémon Gigantamax</h1>
    <div class="pokemon">
      <Card :pokemons="pokemons" :variants="'gmax'" />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.pokemon {
  @apply grid w-full grid-cols-3 gap-2;
}
</style>
