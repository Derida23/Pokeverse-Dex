<script setup lang="ts">

const { getGigantamax } = useApiVariation()
const { data: pokemons } = await getGigantamax()

</script>
<template>
  <div>
    <BaseTitle>Pokémon Gigantamax</BaseTitle>
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
