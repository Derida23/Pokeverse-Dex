<!-- eslint-disable max-len -->
<script setup lang="ts">
import type { PokemonDetail } from '~/types/api/PokemonDetail'
import type { PokemonId } from '~/types/api/Pokemons'
import { pokemons as primary } from '~/constants/pokemons'

const loading = ref(false)
const loadingPokemon = ref(false)
const selected = reactive<number[]>([])
const pokemons = reactive<PokemonDetail[]>([])
const readMore = ref(false)

const { getCompare } = useApiPokemon()
const { getPokemon } = useApiPokemon()
const router = useRouter()
const route = useRoute()

const { width } = useScreenSize()
const isTablet = computed(() => width.value <= 768)

async function search(q: string) {
  loading.value = true
  const { data } = await getCompare(0, 21, { q })
  loading.value = false
  return data
}

async function handleCompare(pokemon: PokemonId, from: string = '') {
  if (selected.includes(pokemon.id)) return;
  loadingPokemon.value = true

  selected.push(pokemon.id);

  const isForm = primary.some(item => item.id === pokemon.id);
  const pokemonName = isForm ? pokemon.name : pokemon.name.split("-")[0];
  const pokemonForm = !isForm ? pokemon.name : undefined;

  const { data } = await getPokemon(pokemonName, pokemonForm)
  pokemons.push(data)
  
  if (!from) {
    handlePath()
  }
  loadingPokemon.value = false
}

function handlePath () {
  const params = pokemons.map(item => item.detail.name).join(".")
  router.push( `/compares?pokemon=${params}`)
}

const selectMenu = ref()
onMounted(async () => {
  const queryParam = route.query.pokemon as string | undefined
  const querySource = route.query.source as string | undefined

  if (selectMenu.value) {
    if (querySource) { 
      const button = selectMenu.value?.trigger.$el.querySelector('button')
      if (button) button.parentNode.dispatchEvent(new Event('click'))
    }
  }
  if (!queryParam) return

  const names = queryParam.split('.')

  for (const fullName of names) {
    const transform = pokemonTransform.find(item => item.name === fullName)
    if (transform) {
      handleCompare(transform, 'route')
    }
  }
})

const placeholder = computed(() => {
  return !selected.length ? "Select pokemon..." : "Select another pokemon..."
})

const statNameMap = computed<Record<string, string>>(() => {
  return {
    hp: isTablet.value ? 'H' : 'HP',
    attack: isTablet.value ? 'A' : 'Attack' ,
    defense: isTablet.value ? 'D' : 'Defense',
    'special-attack': isTablet.value ? 'S' : 'Sp. Att',
    'special-defense': isTablet.value ? 'S' : 'Sp. Def',
    'speed': isTablet.value ? 'S' : 'Speed',
  }
})

function totalStatus(data: PokemonDetail){
  return data.status.map(item => item.base_stat).reduce((a, b) => a + b, 0)
}


function information (data: PokemonDetail) {
  const keyNameMap: Record<string, string> = {
    base_experience: 'Base Exp',
  }
  
  const formatValue = (key: string, value: string) => {
    if (key === 'habitat') return capitalize(value.replace(/-/g, ' '))
    if (key === 'growth_rate') return capitalize(value.replace(/-/g, ' '))
    if (key === 'generation') return getGenName(Number(value)) ?? ''

    return value
  }

  return Object.entries(data.dex).map(([key, rawValue]) => {
    const title = keyNameMap[key]
      ?? key.includes('_')
        ? key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : capitalize(key)

    const description = formatValue(key, rawValue.toString())

    return { title, description }
  })
}

function typeList(type: number[]) {
  const types: { name: string, id: string }[] = []

  type.forEach((t) => {
    types.push({
      name: getNameTypes(t),
      id: t.toString()
    })
  })

  return types
}

function handleRemove (id: number) {
  const index = pokemons.findIndex(p => p.detail.id === id)
  const indexSelect = selected.findIndex(p => p === id)
  
  if (index !== -1) {
    pokemons.splice(index, 1)
    selected.splice(indexSelect, 1)
  }
  handlePath()
}

</script>

<!-- eslint-disable max-len -->
<template>
  <div>
    <BaseTitle>Compare Pokémons</BaseTitle>

    <section class="flex items-center gap-x-2">
      <USelectMenu
        ref="selectMenu"
        :model-value="[]"
        :loading="loading" :searchable="search" :placeholder leading-icon="i-lucide-search"
        option-attribute="name" trailing size="md" by="id" :debounce="500">
        <template #option="{ option }">
          <div
            ref="buttonclick"
            class="px-3.5 py-2.5 w-full" 
            :class="selected.includes(option.id) && 'text-sky-500/50 dark:text-sky-300'"
            @click.stop="handleCompare(option)"
            @mousedown.stop>
            {{ getName(option.name) }}
          </div>
        </template>
      </USelectMenu>
      <UIcon
        v-if="loadingPokemon"
        name="i-ic-twotone-catching-pokemon" 
        class="animate-spin text-2xl"/>
    </section>

    <div v-if="pokemons.length" class="mt-10">
      <div
        class="-mx-3.5 grid overflow-y-auto pb-8 md:-mx-6 lg:mx-0"
        :style="`grid-template-columns: 4.375rem repeat(${pokemons.length}, minmax(15rem, 1fr));`">

        <!-- Section divider -->
        <div class="title" />
        <div 
          v-for="item, id in pokemons" 
          :key="id" 
          class="border-r border-dashed flex flex-col relative items-center justify-between py-4">
          <UButton
            icon="i-lucide-circle-x"
            size="xs"
            color="red"
            square
            variant="soft"
            class="absolute top-0"
            :class="pokemons.length > 1 ? 'right-4' : 'right-40'"
            @click="handleRemove(item.detail.id)"
          />
           <img 
            :src="`https://pokemon-img.pages.dev/600x600/${item.detail.id}.webp`"
            class="w-24" >
            <p class="text-stone-600 dark:text-stone-200 mb-1">{{ getPokemonId(item.detail.id) }}</p>
            <p class="font-semibold text-lg mb-2">{{ getName(item.detail.name) }}</p>
            <PokemonType :list="typeList(item.detail.type)" class="!text-xs"/>
        </div>
        
        <!-- Section divider -->
        <div class="title">
          <div class="flex-center flex-col gap-4 border-bottom">
            <UIcon name="i-solar-mirror-right-broken" class="text-xl text-stone-500 dark:text-stone-200" />
            <UIcon name="i-hugeicons-weight-scale" class="text-xl text-stone-500 dark:text-stone-200" />
            <div class="flex items-center">
              <SvgoSymbolsMan class=" text-stone-500 dark:text-stone-200" />
              <p class="text-center mx-1">:</p>
              <SvgoSymbolsFemale class=" text-stone-500 dark:text-stone-200" />
            </div>
          </div>
        </div>
        <div 
          v-for="item, id in pokemons" 
          :key="id" 
          class="flex flex-col gap-[1.1rem] text-center border-bottom border-r">
          <p class="text-sm">{{ getSize(item.detail.height) }} m</p>
          <p class="text-sm">{{ getSize(item.detail.weight) }} kg</p>
          <div class="flex-center gap-x-1">
            <p class="text-sm">{{ item.detail.gender.male }}</p>
            <p class="text-sm">:</p>
            <p class="text-sm">{{ item.detail.gender.female }}</p>

          </div>
        </div>

        <!-- Section divider -->
        <div class="title">
          <div class="flex-center h-full border-bottom">
            <UIcon name="i-ph-egg-crack" class="text-xl text-stone-500 dark:text-stone-200"/>
          </div>
        </div>
        <div
          v-for="item, id in pokemons" 
          :key="id" 
          class="flex-center flex-col border-bottom border-r">
          <div class="text-sm mb-1">
            <span 
              v-for="(egg, index) in item.breeding.egg_groups" 
              :key="index"
              @click="router.push(`/egg-groups/${egg}`)">
              <span
                class="text-blue-600 dark:text-blue-300 cursor-pointer hover:underline"
              >
                {{ capitalize(egg) }}
              </span>
              <span v-if="index < item.breeding.egg_groups.length - 1" class="mr-1">, </span>
            </span>
          </div>
          <p class="text-sm">{{ item.breeding.egg_cycle }} Cycles</p>
        </div>

        <!-- Section divider -->
        <div class="title">
          <div class="flex h-full justify-center border-bottom">
            <UIcon name="i-solar-info-circle-broken" class="text-xl text-stone-500 dark:text-stone-200"/>
          </div>
        </div>

        <div
          v-for="item, id in pokemons" 
          :key="id" 
          class="flex-center flex-col p-2 border-bottom border-r">
          <div class="bg-zinc-50 dark:bg-zinc-600 rounded-lg px-3 pt-4">
            <PokemonDex :data="information(item)" />
          </div>
        </div>

        <!-- Section divider -->
        <div class="title">
          <div
            class="flex-center h-full border-bottom
             text-sm text-stone-700 dark:text-stone-200 text-center">
            Base <br>Stats
          </div>
        </div>

        <div
          v-for="item, id in pokemons" 
          :key="id" 
          class="flex px-4 border-bottom border-r">
          <div class="flex-center flex-col w-full">
            <div :class="pokemons.length > 1 ? 'w-full' : 'w-full md:w-1/2'">
              <div 
                v-for="stats, index in item.status" 
                :key="index"
                class="card-status">
                <div class="card-status-title" :class="[{'!text-left !w-4': pokemons.length > 2 || isTablet}]">
                  <p>{{ pokemons.length > 2 ? statNameMap[stats.name].charAt(0): statNameMap[stats.name] }}</p>
                </div>

                <div class="progress">
                  <div 
                    class="progress-active" 
                    :class="`bg-skill-${getNameTypes(item.detail.type[0])}`"
                    :style="`width: ${(stats.base_stat / 255) * 100}%`"/>
                  <div class="progress-base"/>
                </div>
                
                <p class="w-10 text-right">{{ stats.base_stat }}</p>
              </div>

              <div class="progress-total">
                <p class="pr-1.5 ">Total: </p>
                <p class="w-10 text-right">{{ totalStatus(item) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section divider -->
        <div class="title">
          <div
            class="flex-center h-full border-bottom 
              text-sm text-stone-700 dark:text-stone-200 text-center">
            Abilities
          </div>
        </div>

        <div
          v-for="item, id in pokemons" 
          :key="id" 
          class="flex items-center justify-start flex-col border-bottom border-r px-2 gap-y-4 ">
            <ul 
              v-for="ability in item.abilities" 
              :key="ability.id" 
              class="bg-zinc-50 dark:bg-zinc-500 p-2 rounded-lg w-full max-w-64 cursor-pointer "
              @click="readMore = !readMore">
              <li>
                <div 
                  class="flex items-center justify-between gap-x-2">
                  <p class="abilities-title text-sm">
                    {{ getName(ability.name) }}
                  </p>
                  <p v-if="ability.is_hidden">
                    <UBadge color="black" size="sm">H</UBadge>
                  </p>
                </div>
                <p v-if="readMore" class="text-xs mt-1 text-stone-500 dark:text-stone-200">{{ ability.short_effect }}</p>
              </li>
            </ul>
        </div>

        <!-- Section divider -->
        <div class="title">
          <div
            class="flex-center h-full border-bottom 
              text-sm text-stone-700 dark:text-stone-200 text-center">
            Type <br > Def.
          </div>
        </div>

        <div
          v-for="item, id in pokemons" 
          :key="id" 
          class="flex flex-col border-bottom border-r pl-4 pr-2">
            <PokemonDefense :defense="item.type.defense" />
        </div>
      </div>
    </div>

    <BasePokedex 
      v-else 
      title="You haven't selected any pokemon yet." 
      description="Choose up to 10 pokemons to compare their stats, type defense, ability, capture-rate, egg group, etc." />
  </div>
</template>

<style scoped lang="postcss">
.border-bottom {
  @apply border-b border-dashed py-4;
}

.title {
  @apply sticky left-0 z-10 w-full border-r bg-zinc-50 dark:bg-zinc-600;
}

.card {
  @apply mt-3 md:grid md:grid-cols-2 gap-x-4;

  &-status {
    @apply flex items-center justify-between mb-2 text-sm gap-x-2;

    &-title {
      @apply w-1/4 text-right first-letter:uppercase;
    }
  }
}

.progress {
  @apply relative w-2/3 h-3 ml-2;

  &-active {
    @apply absolute h-full rounded-l-full;
  }

  &-base {
    @apply w-full h-full rounded-full bg-stone-200/50 dark:bg-stone-500/20;
  }

  &-total {
    @apply flex items-center justify-end text-sm font-semibold;
  }
}

:deep(li[role="option"]) {
  @apply px-0 py-0 cursor-pointer; 
}

:deep(li[role="option"] div) {
  @apply w-full gap-0;
}

</style>
