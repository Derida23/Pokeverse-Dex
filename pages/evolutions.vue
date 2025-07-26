<!-- eslint-disable @typescript-eslint/no-dynamic-delete -->
<script setup lang="ts">
import { generations, types } from '@/constants/filter'
import type { Evolution } from '~/types/responses/Evolution'
import type { FilterEvo, FilterValue } from '@/types/components/Pokemons'

const { getEvolution } = useApiEvolution()
const route = useRoute()
const router = useRouter()
const open = reactive({
  generations: false,
  type: false,
})

const filter = reactive<Record<FilterEvo, FilterValue>>({
  gen: null,
  type: null,
})

const page = ref(0)
const limit = 21
const isLastPage = ref(false)

const infiniteScrollTrigger = ref(null)
let observer: IntersectionObserver | null = null

const evolution = ref<Evolution[]>([])

async function fetchData (isQuery = false) {
  if (!isQuery) page.value++
  
  const offset = page.value * limit
  const response = await getEvolution(offset, limit, filter)

  if (!isQuery) {
    evolution.value.push(...response.data)
  } else {
    evolution.value = [...response.data]
  }

  isLastPage.value = !response.pagination.hasMore
}

// Label getters
const selectedGenLabel = computed(() =>
  generations[0].find(({ id }) => id == filter.gen)?.label ?? 'Unknown'
)

const selectedTypeLabel = computed(() =>
  types[0].find(({ name }) => name == filter.type)?.label ?? 'Unknown'
)

// Observe scroll trigger
onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !isLastPage.value) fetchData()
  })

  if (infiniteScrollTrigger.value) {
    observer.observe(infiniteScrollTrigger.value)
  }
})

onBeforeUnmount(() => {
  if (infiniteScrollTrigger.value) {
    observer?.unobserve(infiniteScrollTrigger.value)
  }
})

// Sync route.query → filter
watch(
  () => route.query,
  async (query) => {
    (['gen', 'type'] as const).forEach((key) => {
      const value = query[key]
      filter[key] = Array.isArray(value) ? value[0] ?? null : value ?? null
    })

    page.value = 0
    await fetchData(true)
  },
  { immediate: true }
)

function handleFilter(type: 'gen' | 'type', id: number ) {
  filter[type] = id

  router.push({
    query: {
      ...route.query,
      [type]: id || undefined
    }
  })
}


function handleReset(value: string | null = null) {
  const keys = ['gen', 'type']
  const newQuery = { ...route.query }

  if (value) {
    if (keys.includes(value)) {
      filter[value as FilterEvo] = null
      delete newQuery[value]
    }
  } else {
    for (const key of keys) {
      filter[value as FilterEvo] = null
      delete newQuery[key]
    }
  }

  router.replace({ query: newQuery })
}
</script>

<template>
  <div>
    <div class="min-h-screen">
      <BaseTitle>Pokémon Evolutions</BaseTitle>
  
      <div class="grid grid-cols-2 gap-2 mb-4 md:grid-cols-4 gap-y-2 md:gap-2">
        <div class="relative">
          <UDropdown 
            v-model:open="open.generations" 
            :items="generations" 
            :popper="{ placement: 'bottom-start' }"
            class="w-full"
            :ui="{
              base: 'max-h-96 overflow-auto',
              item: {
                padding: 'px-0 py-0',
              }
            }"
          >
            <template #item="{ item }">
              <div class="w-full px-3 py-2 text-left" @click="handleFilter('gen', item.id)">
                <p :class="{ 'text-sky-500 font-medium': selectedGenLabel === item.label }">
                  {{ item.label }}
                </p>
              </div>
            </template>
  
            <UButton block color="white" class="h-9">
              <div class="flex items-center justify-between w-full px-1 font-light text-gray-500">
                <div>
                  <p v-if="!filter.gen" class="truncate">Any generations</p>
                  <p v-else class="font-medium">{{ selectedGenLabel }}</p>
                </div>
                <div class="flex items-center">
                  <UIcon v-if="!open.generations" name="i-lucide-chevron-down" class="text-lg"/>
                  <UIcon v-else name="i-lucide-chevron-up" class="text-lg"/>
                </div>
              </div>
            </UButton>
          </UDropdown>
  
          <div v-if="filter.gen" class="absolute top-0 right-0 flex items-center pr-2 h-9">
            <UButton
              icon="i-lucide-circle-x"
              size="xs"
              color="red"
              square
              variant="soft"
              @click="handleReset('gen')"
            />
          </div>
        </div>
  
        <div class="relative">
        <UDropdown 
          v-model:open="open.type" 
          :items="types" 
          :popper="{ placement: 'bottom-start' }"
          class="w-full"
          :ui="{
            base: 'max-h-96 overflow-auto',
            item: {
              padding: 'px-0 py-0',
            }
          }"
        >
          <template #item="{ item }">
            <div 
              class="flex items-center justify-between w-full px-3 py-2"  
              :class="{'text-sky-500 font-medium': selectedTypeLabel === item.label}"
              @click="handleFilter('type', item.name)"
            >
              <p>{{ item.label }}</p>
              <component 
                :is="`svgo-types-${item.name}`" 
                class="w-4 h-4"
              />
            </div>
          </template>
  
          <UButton block color="white" class="h-9" >
            <div class="flex items-center justify-between w-full px-1 font-light text-gray-500">
              <div>
                <p v-if="!filter.type">Any types</p>
                <p v-else class="font-medium">{{ selectedTypeLabel }}</p>
              </div>
              <div class="flex items-center">
                <UIcon v-if="!open.type" name="i-lucide-chevron-down" class="text-lg"/>
                <UIcon v-else name="i-lucide-chevron-up" class="text-lg"/>
              </div>
            </div>
          </UButton>
        </UDropdown>
  
        <div v-if="filter.type" class="absolute top-0 right-0 flex items-center pr-2 h-9">
          <UButton
            icon="i-lucide-circle-x"
            size="xs"
            color="red"
            square
            variant="soft"
              @click="handleReset('type')"
          />
        </div>
      </div>
  
      </div>
  
      <UDivider  class="mb-4"/>
  
      <section v-for="evo, id in evolution" :key="id" class="mb-5">
        <div class="grid gap-1 md:grid-cols-3">
  
          <!-- Card 1 -->
          <section v-for="stage, idx in evo.evolves_to" :key="idx">
            <EvoCard :evo="stage" :item="false"/>
          </section>
  
          <div class="flex flex-col gap-y-3">
            <section 
              v-for="stage, idx in evo.evolves_to[0].evolves_to" 
              :key="idx">
              <EvoCard :evo="stage" />
            </section>
          </div>
  
          <div class="flex flex-col gap-y-3">
            <section 
              v-for="stage, idx in evo?.evolves_to[0]?.evolves_to[0]?.evolves_to ?? []" 
              :key="idx" class="pl-16 md:pl-0">
              <EvoCard :evo="stage" />
            </section>
          </div>
  
        </div>
      </section>
    </div>
    <div ref="infiniteScrollTrigger" class="h-6 -mt-10"/>
  </div>
</template>

