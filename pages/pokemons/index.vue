<!-- eslint-disable @typescript-eslint/no-dynamic-delete -->
<script setup lang="ts">
import type { Pokemons } from '@/types/responses/Pokemons'
import { generations, types, forms } from '@/constants/filter'
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

const open = reactive({ generations: false, types: false, attr: false })
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


// Label getters
const selectedGenLabel = computed(() =>
  generations[0].find(({ id }) => id == filter.value.gen)?.label ?? 'Unknown'
)

const selectedTypeLabel = computed(() =>
  types[0].find(({ name }) => name == filter.value.type)?.label ?? 'Unknown'
)

function selectedAttrLabel (value: string) {
  const attrStr = String(filter.value.attr ?? '')
  const isAttr = attrStr.split('.').includes(value)
  
  return isAttr
}
</script>

<template>
  <div class="m-auto ">
    <p class="mb-6 text-2xl font-bold">Pokémon Species</p>
    <!-- Filter Section -->
    <section>
      <div class="grid grid-cols-4 mb-4 gap-x-2">
        
        <div class="relative">
          <UInput
            v-model="filter.q as string"
            icon="i-lucide-search"
            size="md"
            color="white"
            :trailing="false"
            placeholder="Search..."
            maxlength="10"
            @update:model-value="handleFilter('q', $event)"
          />
          <div v-if="filter.q" class="absolute top-0 right-0  pr-2 h-9 flex items-center">
            <UButton
              icon="i-lucide-circle-x"
              size="xs"
              color="red"
              square
              variant="soft"
              @click="handleReset('q')"
            />
          </div>
        </div>

        <div class="relative">
          <UDropdown 
            v-model:open="open.generations" 
            :items="generations" 
            :popper="{ placement: 'bottom-start' }"
            :ui="{
              base: 'max-h-96 overflow-auto',
              item: {
                padding: 'px-0 py-0',
              }
            }"
          >
            <template #item="{ item }">
              <div class="w-full px-3 py-2 text-left" @click="handleFilter('gen', item.id)">
                <p :class="{  'text-sky-500 font-medium': selectedGenLabel === item.label}">
                  {{ item.label }}
                </p>
              </div>
            </template>
  
            <UButton block color="white" class="w-[202px] h-9">
              <div class="flex items-center justify-between w-full px-1 font-light text-gray-500">
                <div>
                  <p v-if="!filter.gen">Any generations</p>
                  <p v-else class="font-medium">{{ selectedGenLabel }}</p>
                </div>
                <div class="flex items-center">
                  <UIcon v-if="!open.generations" name="i-lucide-chevron-down" class="text-lg"/>
                  <UIcon v-else name="i-lucide-chevron-up" class="text-lg"/>
                </div>
              </div>
            </UButton>
          </UDropdown>
  
          <div v-if="filter.gen" class="absolute top-0 right-0 pr-2 h-9 flex items-center">
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
            v-model:open="open.types" 
            :items="types" 
            :popper="{ placement: 'bottom-start' }"
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

            <UButton block color="white" class="w-[202px] h-9" >
              <div class="flex items-center justify-between w-full px-1 font-light text-gray-500">
                <div>
                  <p v-if="!filter.type">Any types</p>
                  <p v-else class="font-medium">{{ selectedTypeLabel }}</p>
                </div>
                <div class="flex items-center">
                  <UIcon v-if="!open.types" name="i-lucide-chevron-down" class="text-lg"/>
                  <UIcon v-else name="i-lucide-chevron-up" class="text-lg"/>
                </div>
              </div>
            </UButton>
          </UDropdown>

          <div v-if="filter.type" class="absolute top-0 right-0 pr-2 h-9 flex items-center">
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
        
        <div class="flex items-center justify-between gap-x-2">

          <UPopover v-model:open="open.attr" :ui="{ placement: 'bottom-start' }">
            <UChip :show="filter.attr !== null" class="w-full" size="lg">
              <UButton color="white" size="lg" class="w-10 h-9 w- p-0">
                <div class="flex items-center justify-center w-full">
                  <UIcon name="i-lucide-filter" class="text-lg text-gray-500 " />
                </div>
              </UButton>
            </UChip>
            
            <template #panel>
              <div class="w-[192px] p-1">
                <div
                  class="button-attr"
                  :class="{'text-sky-500 font-medium': !filter.attr}"
                  @click="handleFilter('attr', 'all')">All</div>
                <UDivider class="py-1"/>
                <div 
                  v-for="attr in forms" :key="attr.id" 
                  class="button-attr" 
                  @click="handleFilter('attr', attr.value)">
                  <div>
                    <p :class="{'text-sky-500 font-medium': selectedAttrLabel(attr.value)}">
                      {{ attr.label }}
                    </p>
                  </div>
                </div>
              </div>
            </template>
            
          </UPopover>
  
          <UButton variant="link" @click="handleReset()">Reset</UButton>
        </div>
      </div>
      <UDivider class="mb-6"/>
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

.button-attr {
  @apply flex items-center justify-between w-full px-3 py-2 text-sm;
  @apply text-gray-600 rounded-md cursor-pointer hover:bg-gray-100 hover:text-gray-700;
}
</style>
