<script setup lang="ts">
import { columnsDefense, columnsOffense, types, typesPokemon } from '@/constants/filter'
const route = useRoute()
const router = useRouter()

const pairType = computed(() => {
  return route.query.pair
})

const type = computed(() => {
  return route.params.slug[0]
})

const pokemon_type = ref()
const pair_type = ref()
const defense = ref()
const pokemons = ref()

const { getType } = useApiTypes()

async function fetchType(name: string, target: 'main' | 'pair') {
  const res = await getType(name.toLowerCase())
  if (!res) return

  if (target === 'main') {
    pokemon_type.value = res
    defense.value = res.defense
    pokemons.value = res?.pokemon ?? []
  } else {
    pair_type.value = res
    handleDefense()
  }
}

onMounted(async () => {
  if (type.value === pairType.value) router.push(`/types/${type.value}`)

  await fetchType(type.value, 'main')

  if (pairType.value) {
    const name = pairType.value.toString()
    await fetchType(name, 'pair')
  }
})

const open = reactive({pokemon: false, pair: false})

async function handlePokemon(name: string, filter: string) {
  const normalize = name.toLowerCase()

  if (normalize === 'none'){
    router.push(`/types/${type.value}`)
    defense.value = pokemon_type.value.defense
    pokemons.value = pokemon_type.value?.pokemon ?? []
    return
  }

  const { pair } = route.query

  if (normalize === type.value) return

  if (filter === 'pokemon') {
    const path = pair && pair !== normalize
      ? `/types/${normalize}?pair=${pair}`
      : `/types/${normalize}`

    router.push(path)
  }

  if (filter === 'pair') {
    router.push(`/types/${type.value}?pair=${normalize}`)
    await fetchType(normalize, 'pair')
  }
}

function handleDefense () {
  const defensed = calculateDefense(pokemon_type.value.defense, pair_type.value.defense);
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

</script>

<template>
  <section>
    <div class="flex items-center mb-3 cursor-pointer gap-x-2 w-fit" @click="router.push('/types')">
      <UIcon name="i-lucide-arrow-left" class="text-xl font-light text-stone-500"/>
      <p class="text-base font-light text-stone-500">Back to type list</p>
    </div>
    
    <div class="flex items-center justify-between">
      <BaseTitle class="!mb-0 first-letter:uppercase">
        {{ type }} <span v-if="pairType"> - {{ getName(pairType?.toString() ?? '') }}</span> Type
      </BaseTitle>

      <div class="flex gap-x-2">
        <!-- Pokemon Filter -->
         <RoundedFilter 
          v-model:open="open.pokemon"
          :type 
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

      <p v-if="pairType" class="mb-3 text-sm first-letter:uppercase">{{ type }}</p>
      <div class="table-offense">
        <TypeHeader :column="columnsOffense" />
        
        <div 
          v-for="poke, id in pokemon_type?.offense" 
          :key="id"
          :class="[{'bg-green-300/20': id === 0}, 
          {'bg-red-300/20': (id + 1 ) === Object.keys(pokemon_type?.offense).length}]"
        >
          <TypeBody :damages="poke" />
        </div>
      </div>

      <div v-if="pairType">
        <p class="mt-4 mb-2 text-sm first-letter:uppercase">{{ pairType }}</p>
        <div class="table-offense">
          <TypeHeader :column="columnsOffense" />
          <div 
            v-for="poke, id in pair_type?.offense" 
            :key="id"
            :class="[{'bg-green-300/20': id === 0}, 
            {'bg-red-300/20': (id + 1 ) === Object.keys(pair_type?.offense).length}]"
          >
            <TypeBody :damages="poke" />
          </div>
        </div>
      </div>
    </TypeCard>


    <TypeCard>
      <template #title>
        Pokemons <span class="text-sm font-light text-stone-500">({{ pokemons?.length }})</span>
      </template>

      <div class="grid grid-cols-5 gap-5">
        <div 
          v-for="pokemon, id in pokemons" 
          :key="id" 
          class="border rounded-lg">
          {{ pokemon.pokemon.name }}
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
