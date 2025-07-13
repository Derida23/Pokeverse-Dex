<script setup lang="ts">
const { getMega } = useApiVariation()

const { data:pokemons } = await getMega()


</script>
<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold">Pokémon Mega Forms</h1>
    <div class="pokemon">
      <Card :pokemons="pokemons" />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.pokemon {
  @apply grid w-full grid-cols-3 gap-2;
}
</style>
