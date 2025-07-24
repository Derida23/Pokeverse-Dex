<script setup lang="ts">
import { columnsDefense,
  columnsOffense,
  types,
  typesPokemon,
  generations } from '@/constants/filter'
import type { Pokemon } from '@/types/responses/Types'

interface Pokemons {
  main: Pokemon[],
  pair: Pokemon[],
  default: PokemonType[]
}

interface PokemonType {
  name: string
  id: number
  type: number[]
  generation: number
}

const route = useRoute()
const router = useRouter()

const pairType = computed(() => {
  return route.query.pair
})

const mainType = computed(() => {
  return route.params.slug[0]
})

const mainPokemonType = ref()
const pairPokemonType = ref()
const defense = ref()
const pokemons = ref<Pokemons>({ main: [], pair: [], default: [] })

const { getType } = useApiTypes()

async function fetchType(name: string, target: 'main' | 'pair') {
  const res = await getType(name.toLowerCase())
  if (!res) return

  if (target === 'main') {
    mainPokemonType.value = res
    defense.value = res.defense
  } else {
    pairPokemonType.value = res
    handleDefense()
  }
  
  pokemons.value[target] = res.pokemon
  defaultPokemon()
}

onMounted(async () => {
  if (mainType.value === pairType.value) router.push(`/types/${mainType.value}`)

  await fetchType(mainType.value, 'main')

  if (pairType.value) {
    const name = pairType.value.toString()
    await fetchType(name, 'pair')
  }
})

const open = reactive({pokemon: false, pair: false})

async function handlePokemon(name: string, filter: string) {
  const normalize = name.toLowerCase()

  if (normalize === 'none'){
    router.push(`/types/${mainType.value}`)
    pokemons.value.pair = []
    defaultPokemon()
    await fetchType(mainType.value, "main")

    return
  }

  const { pair } = route.query

  if (normalize === mainType.value) return

  if (filter === 'pokemon') {
    const path = pair && pair !== normalize
      ? `/types/${normalize}?pair=${pair}`
      : `/types/${normalize}`

    router.push(path)
  }

  if (filter === 'pair') {
    router.push(`/types/${mainType.value}?pair=${normalize}`)
    await fetchType(normalize, 'pair')
  }
}

function handleDefense () {
  const defensed = calculateDefense(mainPokemonType.value.defense, pairPokemonType.value.defense);
  const grouped = groupByEffectiveness(defensed);
  
  const normalize = {
    no_damage: grouped['0x'],
    quarter_damage: grouped['0.25x'],
    half_damage: grouped['0.5x'],
    single_damage: grouped['1x'],
    double_damage: grouped['2x'],
    fourth_damage: grouped['4x'],
  }
  
  defense.value = normalize
}

function defaultPokemon() {
  const all = [
    ...toRaw(pokemons.value.main ?? []),
    ...toRaw(pokemons.value.pair ?? [])
  ];

  const ids = all.map(item => Number(getID(item.pokemon.url)));

  const filtered: PokemonType[] = pokemonTransform.filter(p =>
    ids.includes(p.id)
  );

  const mainId = types[0].find(t => t.name === mainType.value)?.id;
  const pairId = types[0].find(t => t.name === pairType.value)?.id;

  const typeId = mainId ? [mainId] : [];
  if (pairId && pairId !== mainId) typeId.push(pairId);

  pokemons.value.default= filterByFlexibleType(filtered, typeId);
}

function filterByFlexibleType(pokemons: PokemonType[], filterType: number[]) {
  return pokemons.filter(p => {
    const t = p.type;

    return filterType.length === 1
      ? t.length === 1 && t[0] === filterType[0]
      : filterType.length === 2 &&
          t.length === 2 &&
          filterType.every(val => t.includes(val));
  });
}

</script>

<template>
  <section>
    <div class="flex items-center mb-3 cursor-pointer gap-x-2 w-fit" @click="router.push('/types')">
      <UIcon name="i-lucide-arrow-left" class="text-xl font-light text-stone-500"/>
      <p class="text-base font-light text-stone-500">Back to type list</p>
    </div>
    
    <div class="flex items-center justify-between">
      <BaseTitle class="!mb-0 first-letter:uppercase">
        {{ mainType }} 
        <span v-if="pairType"> - {{ getName(pairType?.toString() ?? '') }}</span> Type
      </BaseTitle>

      <div class="flex gap-x-2">
        <!-- Pokemon Filter -->
         <RoundedFilter 
          v-model:open="open.pokemon"
          :type="mainType" 
          :items="types"
          @handle-pokemon="handlePokemon"/>

        <!-- Pair pokemon filter -->

         <RoundedFilter
          v-model:open="open.pair"
          :type="pairType?.toString() ?? ''"
          :items="typesPokemon"
          :pair="true"
          @handle-pokemon="handlePokemon"/>
      </div>
    </div>

    <!-- Defense Pokemon -->
    <TypeCard >
      <template #title>
        Defense <span class="text-xs font-light text-stone-500">(damage taken)</span>
      </template>
      
      <div class="table-defense">
        <TypeHeader :column="columnsDefense" />
        <div 
          v-for="poke, id in defense" 
          :key="id"
          :class="[{'bg-green-300/20': id === 0}, 
          {'bg-red-300/20': (id + 1 ) === Object.keys(defense).length}]"
        >
          <TypeBody :damages="poke" />
        </div>
      </div>
    </TypeCard>

    <TypeCard>
      <template #title>
        Offense 
      </template>

      <p v-if="pairType" class="mb-3 text-sm first-letter:uppercase">{{ mainType }}</p>
      <div class="table-offense">
        <TypeHeader :column="columnsOffense" />
        
        <div 
          v-for="poke, id in mainPokemonType?.offense" 
          :key="id"
          :class="[{'bg-green-300/20': id === 0}, 
          {'bg-red-300/20': (id + 1 ) === Object.keys(mainPokemonType?.offense).length}]"
        >
          <TypeBody :damages="poke" />
        </div>
      </div>

      <div v-if="pairType">
        <p class="mt-4 mb-2 text-sm first-letter:uppercase">{{ pairType }}</p>
        <div class="table-offense">
          <TypeHeader :column="columnsOffense" />
          <div 
            v-for="poke, id in pairPokemonType?.offense" 
            :key="id"
            :class="[{'bg-green-300/20': id === 0}, 
            {'bg-red-300/20': (id + 1 ) === Object.keys(pairPokemonType?.offense).length}]"
          >
            <TypeBody :damages="poke" />
          </div>
        </div>
      </div>
    </TypeCard>


    <TypeCard>
      <template #title>
        Pokemons <span class="text-sm font-light text-stone-500">
          ({{ pokemons.default.length }})
        </span>
      </template>

      <div class="grid grid-cols-5 gap-5 ">
        <div 
          v-for="pokemon, id in pokemons.default" 
          :key="id" 
          class="border rounded-lg p-2 flex justify-center relative">
          <div>
            <img 
              :src="`https://pokemon-img.pages.dev/128x128/${pokemon.id}.webp`" 
              class="w-24 mx-auto">
            <p class="text-stone-800 text-center first-letter:uppercase text-xs mt-2">
              {{ pokemon.name.split("-").join(" ") }}
            </p>
            <p
              class="absolute top-0 right-0 text-xs
             bg-gray-300/20 px-2 py-1 rounded-tr rounded-bl-lg">
              <!-- {{ generations[0][pokemon.generation].label.split(" ")[1] }} -->
                {{ generations[0].find((item) => 
                item.id === pokemon.generation)?.label.split(" ")[1] }}
            </p>
          </div>
        </div>
      </div>
      
    </TypeCard>
  </section>
</template>

<style scoped lang="postcss">
.table-defense {
  @apply grid grid-flow-col grid-cols-[2.75rem_1fr] grid-rows-[repeat(6,minmax(0,auto))];
  @apply md:grid-flow-row md:grid-cols-[repeat(6,minmax(3rem,auto))] md:grid-rows-none;
  @apply border-l border-t *:border-b *:border-r *:p-2;
}

.table-offense {
  @apply grid grid-flow-col grid-cols-[2.75rem_1fr] grid-rows-[repeat(4,minmax(0,auto))];
  @apply md:grid-flow-row md:grid-cols-[repeat(4,minmax(3rem,auto))] md:grid-rows-none;
  @apply border-l border-t *:border-b *:border-r *:p-2;
}

.badge {
  @apply flex flex-wrap items-start gap-2;

  &-content {
    @apply first-letter:uppercase py-0.5 px-2 rounded-xl text-xs;
  }
}
</style>
