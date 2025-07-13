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
  <div class="m-auto ">
    <h1 class="mb-6 text-2xl font-bold">Pokémon Species</h1>

    <!-- Filter Section -->
    <section>
      <Filter
        :filter="filter"
        @handle-filter="handleFilter"
        @handle-reset="handleReset"
      />
    </section>

    <!-- Content Section -->
    <section>
      <div class="pokemon">
        <Card :pokemons />
      </div>
    </section>

    <div v-if="isLoading">
      <LoadingSkeleton />
    </div>
    
    <div ref="infiniteScrollTrigger" class="h-6 -mt-10"/>

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
    @apply text-xs text-slate-600;
  }

  &-types {
    @apply flex items-center text-xs gap-x-1;

    &-circle {
      @apply w-4 h-4 border rounded-full border-black/20;
    }

    &-circle-option {
      @apply w-3.5 h-3.5 ml-[-4px] rounded-full border border-black/20;
    }
  }

  &-artwork {
    @apply absolute right-0 z-10 w-32 top-2;
  }
}
</style>
