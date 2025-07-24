<script setup lang="ts">
const { getMega } = useApiVariation()

const { data:pokemons } = await getMega()


</script>
<template>
  <div>

    <BaseTitle>Pokémon Mega Forms</BaseTitle>
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
