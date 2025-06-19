<script setup lang="ts">
import type { PokemonsType } from '~/types/responses/PokemonsType';

const { getAll } = useApiPokemon()

const pokemons = ref<PokemonsType[]>([])
pokemons.value = await getAll()

const page = ref(1)
const limit = 21
const isLoading = ref(false)

const infiniteScrollTrigger = ref(null)
let observer: IntersectionObserver | null = null

const fetchMore = async () => {
  if (isLoading.value) return
  isLoading.value = true

  const offset = page.value * limit
  const data = await getAll(offset, limit)

  pokemons.value.push(...data)
  page.value++
  isLoading.value = false
}

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      fetchMore()
      console.log('Fetching more pokemons...')
    }
  })

  if (infiniteScrollTrigger.value) {
    observer.observe(infiniteScrollTrigger.value)
  }
})

onBeforeUnmount(() => {
  if (observer && infiniteScrollTrigger.value) {
    observer.unobserve(infiniteScrollTrigger.value)
  }
})
</script>

<template>
  <div class="m-auto ">
    <div class="pokemon">
      <div 
        v-for="(data, index) in pokemons" 
        :key="index"
        class="pokemon-card"
        :class="`bg-type-${data.types[0].type.name}`" 
      >
        <div class="pokemon-content">
          <section>
            <p class="pokemon-name">{{ data.name }}</p>
            <p class="pokemon-id">{{ String(data.id).padStart(4, '0') }}</p>
            <div class="pokemon-types">
              <p v-for="type, id in data.types" :key="id" class="first-letter:uppercase">
                {{ type.type.name }}
                <span v-if="Number(id+1) < data.types.length" class="ml-[-2px]">,</span>
              </p>
            </div>

            <div class="flex items-end mt-1">
              <div
                class="pokemon-types-circle" 
                :class="`bg-skill-${data.types[0].type.name}`" 
              />
              <div
                v-if="data.types.length > 1" 
                class="pokemon-types-circle-option"
                :class="`bg-skill-${data.types[1].type.name}`" 
              />
            </div>
          </section>
          <img
            class="pokemon-artwork" 
            :src="`https://pokemon-img.pages.dev/192x192/${data.id}.webp`"
            >
        </div>

        <p class="pokemon-name-alternative">
          {{ data.japanese_name }}
        </p>
      </div>
    </div>

    <div v-if="isLoading">
      <LoadingSkeleton />
    </div>
    
    <div ref="infiniteScrollTrigger" class="h-6"/>

  </div>
</template>

<style scoped lang="postcss">
.pokemon {
  @apply grid w-full grid-cols-3 gap-2;
  
  &-card {
    @apply py-3 pl-3 border shadow-sm;
    @apply cursor-pointer;
    @apply border-slate-200 hover:border-slate-300 h-36 rounded-xl;
    @apply relative overflow-hidden ;
  }

  &-content {
    @apply z-10 h-full;
    @apply flex items-center justify-between ;
  }

  &-name {
    @apply font-semibold first-letter:uppercase;

    &-alternative {
      @apply absolute z-0 text-4xl font-black right-2 top-14 text-slate-800/10;
    }
  }

  &-id {
    @apply mt-1 mb-3 text-xs text-slate-600;
  }

  &-types {
    @apply flex items-center text-xs gap-x-1;

    &-circle {
      @apply w-4 h-4 border rounded-full border-slate-300;
    }

    &-circle-option {
      @apply w-3.5 h-3.5 ml-[-4px] rounded-full border border-slate-300;
    }
  }

  &-artwork {
    @apply absolute right-0 z-10 w-32 top-2;
  }
}
</style>
