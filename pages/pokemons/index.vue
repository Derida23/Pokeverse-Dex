<script setup lang="ts">
import type { Pokemons } from '@/types/responses/Pokemons'
import { generations, types } from '~/constants/filter'
import type { FilterKey, FilterValue } from '~/types/components/Pokemons'

const router = useRouter()
const route = useRoute()
const { getAll } = useApiPokemon()

const filter = ref<Record<FilterKey, FilterValue>>({
  gen: null,
  type: null,
  q: null,
  attr: null
})

const open = reactive({ generations: false, types: false })
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
  const data = await getAll(offset, limit, filter.value)
  
  // Mark as last page if fewer items than limit
  if (data.length < limit) {
    isLastPage.value = true
  }

  if (!isQuery) {
    pokemons.value.push(...data)
  } else {
    pokemons.value = data
  }

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
  } else {
    filter.value[type] = value ?? null
    updateQuery(type, value)
  }
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

// Label getters
const selectedGenLabel = computed(() =>
  generations[0].find(({ id }) => id == filter.value.gen)?.label ?? 'Unknown'
)

const selectedTypeLabel = computed(() =>
  types[0].find(({ name }) => name == filter.value.type)?.label ?? 'Unknown'
)

</script>

<template>
  <div class="m-auto ">
    <p class="mb-6 text-3xl font-bold">Pokémon Species</p>
    <!-- Filter Section -->
     <section>
       <div class="grid grid-cols-4 mb-4 gap-x-2">
   
         <UInput
           v-model="filter.q as string"
           icon="i-lucide-search"
           size="md"
           color="white"
           :trailing="false"
           placeholder="Search..."
           @update:model-value="handleFilter('q', $event)"
         />
   
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
               <p :class="selectedGenLabel === item.label ? 'text-sky-500 font-semibold' : ''">
                 {{ item.label }}
               </p>
             </div>
           </template>
           <UButton block color="white"  >
             <div class="flex items-center justify-between w-full px-1 font-light text-gray-500">
               <div>
                 <p v-if="!filter.gen">Any generations</p>
                 <p v-else class="font-semibold">{{ selectedGenLabel }}</p>
               </div>
               <div class="flex items-center">
                 <UIcon v-if="!open.generations" name="i-lucide-chevron-down" class="text-lg"/>
                 <UIcon v-else name="i-lucide-chevron-up" class="text-lg"/>
               </div>
             </div>
           </UButton>
         </UDropdown>
   
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
               :class="selectedTypeLabel === item.label ? 'text-sky-500 font-semibold' : ''"
               @click="handleFilter('type', item.name)"
             >
               <p>{{ item.label }}</p>
               <component 
                 :is="`svgo-types-${item.name}`" 
                 class="w-4 h-4"
               />
             </div>
           </template>
           <UButton block color="white"  >
             <div class="flex items-center justify-between w-full px-1 font-light text-gray-500">
               <div>
                 <p v-if="!filter.type">Any types</p>
                 <p v-else class="font-semibold">{{ selectedTypeLabel }}</p>
               </div>
               <div class="flex items-center">
                 <UIcon v-if="!open.types" name="i-lucide-chevron-down" class="text-lg"/>
                 <UIcon v-else name="i-lucide-chevron-up" class="text-lg"/>
               </div>
             </div>
           </UButton>
         </UDropdown>
       </div>
       <UDivider class="mb-6"/>
     </section>
    
     <!-- Content Section -->
     <section>
       <div class="pokemon">
         <div 
           v-for="(data, index) in pokemons" 
           :key="index"
           class="pokemon-card"
           :class="`bg-type-${data.types[0].type.name}`" 
         >
           <div class="pokemon-content">
             <section>
              <div class="w-[150px] ">
                <p class="truncate pokemon-name">{{ data?.title ?? '' }}</p>
              </div>
               <p class="pokemon-id">{{ String(data.id).padStart(4, '0') }}</p>
               <div class="pokemon-types">
                 <p v-for="type, id in data.types" :key="id" class="first-letter:uppercase">
                   {{ type.type.name }}
                   <span v-if="Number(id+1) < data.types.length" class="ml-[-2px]">,</span>
                 </p>
               </div>
   
               <div class="flex items-center mt-1">
                 <div class="flex items-end ">
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
                 <p
                    v-if="(data.form?.length ?? 0) > 1"
                    class="ml-1 text-xs font-semibold text-slate-500"> 
                    — {{ data.form?.length }} Forms</p>
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
     </section>

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
