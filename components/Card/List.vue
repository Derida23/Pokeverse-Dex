<script lang="ts" setup>
import type { Pokemons } from '@/types/responses/Pokemons'

const props = defineProps({
  pokemons: {
    type: Array as () => Pokemons[],
    required: true
  },
  variants: {
    type: String,
    default: ''
  }
})

const router = useRouter()

function handleRouter(name: string) {
  if (props.variants) {
    router.push(`/pokemons/${name.split("-")[0]}/${name}`)
  } else {
    router.push(`/pokemons/${name}`)
  }
}
</script>

<template>
  <div class="pokemon">
    <div
      v-for="(data, index) in props.pokemons" 
      :key="index" 
      class="pokemon-card"
      :class="`bg-type-${getNameTypes(data.types[0][0])}`"
      @click="handleRouter(data.name)">
  
      <div class="pokemon-content">
        <section>
          <div class="pokemon-name-wrapper">
            <p class="pokemon-name">{{ getName(data.name) }}</p>
          </div>
  
          <div class="pokemon-id-wrapper">
            <p class="pokemon-id">{{ String(data.id).padStart(4, '0') }}</p>
            <div class="pokemon-types-icons">
              <UIcon v-if="data.attr.is_baby" name="i-lucide-egg" class="animate-bounce" />
              <UIcon v-if="data.attr.is_legendary" name="i-lucide-star" class="animate-spin" />
              <UIcon
                v-if="data.attr.is_mythical"
                name="i-lucide-circle-dot-dashed"
                class="animate-pulse"
              />
              <UIcon
                v-if="data.attr.is_mega && !data.attr.is_legendary"
                name="i-lucide-circle-small"
                class="text-[8px] mb-[1px] animate-ping" />
            </div>
          </div>
  
          <div class="pokemon-types">
            <p v-for="type, id in data.types[0]" :key="id" class="first-letter:uppercase">
              {{ getNameTypes(type) }}
              <span v-if="Number(id + 1) < data.types[0].length" class="ml-[-2px]">,</span>
            </p>
          </div>
  
          <div class="pokemon-types-color">
            <div v-for="type, id in data.types" :key="id" class="flex items-end mr-1">
              <div class="pokemon-types-circle" :class="`bg-skill-${getNameTypes(type[0])}`" />
              <div
                v-if="type.length > 1"
                class="pokemon-types-circle-option"
                :class="`bg-skill-${getNameTypes(type[1])}`" />
            </div>
            
            <p v-if="data.forms > 1" class="pokemon-text-forms">
              — {{ data.forms }} Forms
            </p>
          </div>
        </section>
        
        <img class="pokemon-artwork" :src="`https://pokemon-img.pages.dev/192x192/${data.id}.webp`">
      </div>
  
      <p class="pokemon-name-alternative">
        {{ data.japanese_name }}
      </p>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.pokemon {
  @apply grid w-full md:grid-cols-3 gap-4 lg:gap-2;
  
  &-card {
    @apply py-3 pl-3 border shadow-sm;
    @apply cursor-pointer;
    @apply border-slate-200 hover:border-slate-300 h-36 rounded-lg;
    @apply relative overflow-hidden;
  }

  &-content {
    @apply z-10 h-full;
    @apply flex items-center justify-between;
  }

  &-name {
    &-wrapper {
      @apply w-[150px];
    }

    @apply font-semibold first-letter:uppercase truncate;

    &-alternative {
      @apply absolute z-0 text-4xl font-black right-2 top-14 text-stone-800/10;
    }
  }

  &-id {
    &-wrapper {
      @apply flex items-center mt-1 mb-3 gap-x-1;
    }

    @apply text-xs text-stone-600;
  }

  &-types {
    @apply flex items-center text-xs gap-x-1;

    &-circle {
      @apply w-4 h-4 border rounded-full border-black/20;
    }

    &-circle-option {
      @apply w-3.5 h-3.5 ml-[-4px] rounded-full border border-black/20;
    }

    &-icons {
      @apply pt-0.5 text-xs text-stone-600;
    }

    &-color {
      @apply flex items-center mt-1;
    }
  }

  &-artwork {
    @apply absolute right-0 z-10 w-32 top-2;
  }

  &-text-forms {
    @apply text-xs font-medium text-stone-500;
  }
}
</style>
