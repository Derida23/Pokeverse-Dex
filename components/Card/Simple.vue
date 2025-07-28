<script setup lang="ts">
import { generations } from '~/constants/filter'

interface PokemonType {
  name: string
  id: number
  type: number[]
  generation: number
}

const props = defineProps({
  pokemons: {
    type: Array as PropType<PokemonType[]>,
    required: true,
  },
})

const router = useRouter()
</script>

<template>
  <div class="pokemons">
    <div 
      v-for="pokemon, id in props.pokemons" 
      :key="id" 
      class="cursor-pointer pokemons-card hover:shadow-sm"
      @click="router.push(`/pokemons/${pokemon.name}`)">
      
      <section>
        <img 
          :src="`https://pokemon-img.pages.dev/128x128/${pokemon.id}.webp`" 
          class="w-20 mx-auto">
        <p class="pokemons-title">
          {{ getName(pokemon.name) }}
        </p>
        <p class="pokemons-generation">
            {{ generations[0].find((item) => 
            item.id === pokemon.generation)?.label.split(" ")[1] }}
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.pokemons {
  @apply grid grid-cols-5 gap-5;

  &-card {
    @apply border rounded-lg p-2 flex justify-center relative;
  }

  &-title {
    @apply text-stone-800 text-center first-letter:uppercase text-xs mt-2;
  }

  &-generation {
    @apply absolute top-0 right-0 text-xs;
    @apply bg-gray-300/20 px-2 py-1 rounded-tr rounded-bl-lg
  }
}
</style>
