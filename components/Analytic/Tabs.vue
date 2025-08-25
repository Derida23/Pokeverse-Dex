<script setup lang="ts">
import type { Ranks } from '~/types/responses/Ranks';
const router = useRouter()

const props = defineProps({
  ranks: {
    type: Array as PropType<Ranks[]>,
    required: true
  }
})
const tabs = [{
  label: 'Information',
  icon: 'i-heroicons-information-circle',
  slot: 'base'
}, {
  label: 'Status',
  icon: 'i-bx-stats',
  slot: 'status'
}]
</script>
<template>
  <UTabs :items="tabs" class="w-full mt-5">
    <template #base>
      <div v-for="pokemon in props.ranks" :key="pokemon.id" class="mt-2">
        <div
        class="flex items-center justify-between p-4
        border border-dashed mb-2 rounded-lg relative cursor-pointer hover:border-sky-500"
        @click="router.push(`/pokemons/${pokemon.name}`)">
          <div
            class="absolute bottom-0 right-0 text-xs p-1
            bg-zinc-300 rounded-tl-md rounded-br-md dark:text-stone-500">
            {{ getGenName(pokemon.generation) }}
          </div>

          <div class="absolute top-2 right-2 text-xs text-stone-500 dark:text-stone-200">
            #{{ getPokemonId(pokemon.id) }}
          </div>

          <div>
            <div class="flex items-center gap-x-2">
              <p class="text-lg font-semibold">{{ capitalize(pokemon.name) }}</p>
              <div class="flex items-center gap-x-1">
                <div
                  v-for="type, id in pokemon.types" 
                  :key="id" 
                  class="p-1.5 rounded-full"
                  :class="`bg-skill-${getNameTypes(type)}`">
                  <component 
                    :is="`svgo-types-${getNameTypes(type)}`" 
                    class="text-xs !m-0 text-white"
                  />
                </div>
              </div>
            </div>

            <div class="mt-3 flex items-center gap-x-2">
              <UIcon 
                name="i-solar-mirror-right-broken" 
                class="text-lg text-stone-500 dark:text-stone-200" />
                <p class="text-xs">{{ getSize(pokemon.height) }} m</p>
            </div>
            <div class="mt-2 flex items-center gap-x-2">
              <UIcon 
                name="i-hugeicons-weight-scale" 
                class="text-lg text-stone-500 dark:text-stone-200" />
                <p class="text-xs">{{ getSize(pokemon.weight) }} kg</p>
            </div>
            <div class="mt-2 flex items-center gap-x-2">
              <UIcon 
                name="i-carbon-crop-growth" 
                class="text-lg text-stone-500 dark:text-stone-200" />
                <p class="text-xs">{{ pokemon.base_experience }} exp</p>
            </div>

          </div>
          <img 
          :src="`https://pokemon-img.pages.dev/600x600/${pokemon.id}.webp`" 
          class="w-28">
        </div>
      </div>
    </template>
    <template #status>
      <div v-for="pokemon in ranks" :key="pokemon.id" class="mt-2">
        <div
        class=" p-4
        border border-dashed mb-2 rounded-lg relative cursor-pointer hover:border-sky-500"
        @click="router.push(`/pokemons/${pokemon.name}`)">
          <div
            class="absolute bottom-0 right-0 text-xs p-1
            bg-zinc-300 rounded-tl-md rounded-br-md dark:text-stone-500">
            {{ getGenName(pokemon.generation) }}
          </div>

          <div class="absolute top-2 right-2 text-xs text-stone-500 dark:text-stone-200">
            #{{ getPokemonId(pokemon.id) }}
          </div>

          <div>
            <div class="flex items-center gap-x-2">
              <p class="text-lg font-semibold">{{ capitalize(pokemon.name) }}</p>
              <div class="flex items-center gap-x-1">
                <div
                  v-for="type, id in pokemon.types" 
                  :key="id" 
                  class="p-1.5 rounded-full"
                  :class="`bg-skill-${getNameTypes(type)}`">
                  <component 
                    :is="`svgo-types-${getNameTypes(type)}`" 
                    class="text-xs !m-0 text-white"
                  />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 mt-2">
              <div>
                <div class="mt-2 grid grid-cols-2 gap-x-2 text-xs">
                  <div class="flex items-center gap-x-1">
                    <UIcon name="i-solar-health-broken" />
                    <p>HP </p>
                  </div>
                  <p>{{ pokemon.status[0].base_stat }}</p>
                </div>

                <div class="mt-2 grid grid-cols-2 gap-x-2 text-xs">
                  <div class="flex items-center gap-x-1">
                    <UIcon name="i-uil-fire" />
                    <p>Att </p>
                  </div>
                  <p>{{ pokemon.status[1].base_stat }}</p>
                </div>

                <div class="mt-2 grid grid-cols-2 gap-x-2 text-xs">
                  <div class="flex items-center gap-x-1">
                    <UIcon name="i-material-symbols-light-health-and-safety-outline" />
                    <p>Def </p>
                  </div>
                  <p>{{ pokemon.status[2].base_stat }}</p>
                </div>

              </div>

              <div>
                <div class="mt-2 grid grid-cols-2 gap-x-2 text-xs">
                  <div class="flex items-center gap-x-1">
                    <UIcon name="i-fluent-fireplace-48-regular" />
                    <p>Sp. Att </p>
                  </div>
                  <p>{{ pokemon.status[3].base_stat }}</p>
                </div>

                <div class="mt-2 grid grid-cols-2 gap-x-2 text-xs">
                  <div class="flex items-center gap-x-1">
                    <UIcon name="i-si-shield-health-safety-duotone" />
                    <p>Sp. Def </p>
                  </div>
                  <p>{{ pokemon.status[4].base_stat }}</p>
                </div>

                <div class="mt-2 grid grid-cols-2 gap-x-2 text-xs">
                  <div class="flex items-center gap-x-1">
                    <UIcon name="i-akar-icons-thunder" />
                    <p>Speed </p>
                  </div>
                  <p>{{ pokemon.status[5].base_stat }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UTabs>
</template>
