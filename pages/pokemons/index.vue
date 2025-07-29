<!-- eslint-disable @typescript-eslint/no-dynamic-delete -->
<script setup lang="ts">
import type { Pokemons } from '@/types/responses/Pokemons'
import type { FilterKey, FilterValue } from '@/types/components/Pokemons'

const router = useRouter()
const route = useRoute()
const { getAll } = useApiPokemon()

const filter = ref<Record<FilterKey, FilterValue>>({
  gen: null,
  type: null,
  q: null,
  attr: null
})

const pokemons = ref<Pokemons[]>([])
const isLoading = ref(false)
const isLastPage = ref(false)

const infiniteScrollTrigger = ref(null)
const page = ref(1)
const limit = 21
let observer: IntersectionObserver | null = null

// Fetch paginated data
const fetchMore = async (isQuery = false) => {
  if (isLoading.value) return
  isLoading.value = true

  if (!isQuery) page.value++
  
  const offset = page.value * limit
  const response = await getAll(offset, limit, filter.value)

  if (!isQuery) {
    pokemons.value.push(...response.data)
  } else {
    pokemons.value = response.data
  }

  isLastPage.value = !response.pagination.hasMore
  isLoading.value = false
}

// Observe scroll trigger
onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !isLastPage.value) fetchMore()
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
    (['gen', 'type', 'q', 'attr'] as const).forEach((key) => {
      const value = query[key]
      filter.value[key] = Array.isArray(value) ? value[0] ?? null : value ?? null
    })

    page.value = 0
    await fetchMore(true)
  },
  { immediate: true }
)

// Debounce for q only
const applyQueryFilter = useDebounceFn((q: FilterValue) => {
  filter.value.q = q ?? null
  updateQuery('q', q)
}, 700)

// Unified filter handler
function handleFilter(type: FilterKey, value: FilterValue) {
  if (type === 'q') {
    applyQueryFilter(value)
    return
  }

  if (type === 'attr') {
    if (value === 'all') {
      filter.value.attr = null
      updateQuery('attr', null)
      return
    }

    const routeAttr = route.query.attr as string | undefined
    const current = routeAttr?.split('.') || []
    const exists = typeof value === 'string' && current.includes(value)

    const updated = exists
      ? current.filter((item) => item !== value)
      : [...current, value as string]

    const result = updated.length > 0 ? updated.join('.') : null
    filter.value.attr = result
    updateQuery('attr', result)
    return
  }

  // Default filter handler
  filter.value[type] = value ?? null
  updateQuery(type, value)
}

// Update router query helper
function updateQuery(type: FilterKey, value: FilterValue) {
  router.push({
    query: {
      ...route.query,
      [type]: value || undefined
    }
  })
}

function handleReset(value: string | null = null) {
  const keys = ['q', 'gen', 'attr', 'type']
  const newQuery = { ...route.query }

  if (value) {
    if (keys.includes(value)) {
      filter.value[value as FilterKey] = null
      delete newQuery[value]
    }
  } else {
    for (const key of keys) {
      filter.value[value as FilterKey] = null
      delete newQuery[key]
    }
  }

  router.replace({ query: newQuery })
}
</script>

<template>
  <div class="w-full m-auto">
    <BaseTitle >Pokémon Species</BaseTitle>

    <!-- Filter Section -->
    <section class="sticky top-3 z-[61]">
      <FilterList
        :filter="filter"
        @handle-filter="handleFilter"
        @handle-reset="handleReset"
      />
    </section>

    <UDivider class="mb-6"/>

    <!-- Content Section -->
    <section>
      <CardList v-if="pokemons.length > 0" :pokemons />
      <Base404 v-else-if="pokemons.length === 0 && !isLoading" />
    </section>

    <div v-if="isLoading">
      <BaseSkeleton />
    </div>
    
    <div ref="infiniteScrollTrigger" class="h-6 -mt-10"/>

  </div>
</template>
