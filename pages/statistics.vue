<script setup lang="ts">
import { types } from '~/constants/filter';
import type { Ranks } from '~/types/responses/Ranks';

const router = useRouter()

const { getAnalytic, getRank } = useApiAnalytic()
const { data } = await getAnalytic()


const filter = reactive({
  status: 'attack',
  gen: 0,
  order: 'asc'
})

const ranks = ref<Ranks[]>([])

onMounted(async () => {
  const { data: rank } = await getRank(filter)
  ranks.value = rank
})


async function handleFilter(name: string, value: string | number) {
  if (name === 'status') {
    filter.status = value as string
  }

  if (name === 'gen') {
    filter.gen = value as number
  }

  if (name === 'order') {
    filter.order = value as string
  }

  const { data: rank } = await getRank(filter)
  ranks.value = rank
}

async function handleReset() {
  filter.gen = 0
  filter.status = 'attack'

  const { data: rank } = await getRank(filter)
  ranks.value = rank
}

const RevenueCategoriesMultple = {
  single: { name: 'Single', color: '#0284c7' },
  dual: { name: 'Dual', color: '#0284c770' },
}

const categories: Record<string, BulletLegendItemInterface> = {
  count: { name: 'Grow', color: '#0284c7' },
  total: { name: 'Total', color: '#0284c770' },
}

</script>

<template >
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-3">
      <div class="lg:col-span-3">
        <div class="grid grid-cols-2 gap-2">
          <AnalyticCard title="Total pokemon" :desc="data.total_pokemon"/>
          <AnalyticCard title="Average power" :desc="data.average_power"/>
        </div>
  
        <div class="flex flex-col items-center rounded-lg">
          <AnalyticDonut :data />
        </div> 
  
        <div class="grid grid-cols-6 gap-4 mt-8">
          <div v-for="type, id in types[0]" :key="id" @click="router.push(`/types/${type.name}`)">
            <UTooltip :text="type.label" :popper="{ offsetDistance: 4 }">
              <div
                class="p-1.5 rounded-full flex-center w-10 h-10 cursor-pointer"
                :class="`bg-skill-${getNameTypes(type.id)}`">
                  <component 
                    :is="`svgo-types-${getNameTypes(type.id)}`" 
                    class="text-xl !m-0 text-white"
                  />
              </div>
            </UTooltip>
          </div>
        </div>
      </div>
      <div class="lg:col-span-2">
        <FilterAnalytics :filter @handle-filter="handleFilter" @handle-reset="handleReset" />
        <AnalyticTabs :ranks />
      </div>
    </div>

    <div class="mt-5">
      <BarChart
        :data="data.types"
        :stacked="true"
        :height="500"
        :categories="RevenueCategoriesMultple"
        :y-axis="['single', 'dual']"
        :group-padding="0"
        :bar-padding="0.1"
        :x-num-ticks="6"
        :radius="4"
        :orientation="Orientation.Horizontal"
        :y-formatter="(i: number): string => `${types[0][i].label}`"
        :legend-position="LegendPosition.Top"
        :hide-legend="false"
        :x-grid-line="true"
      >
        <template #tooltip="{ values }">
          <div>
            <h2 class="!text-base">Type {{ values?.type }}</h2>
            <p class="text-sm mt-2">Single: {{ values?.single }} Pokemon</p>
            <p class="text-sm">Dual: {{ values?.dual }} Pokemon</p>
          </div>
        </template>
      </BarChart>
    </div>

    <div class="mt-5">
      <AreaChart
        :data="data.generations"
        :height="300"
        x-label="Generation"
        y-label="Total"
        :categories="categories"
        :y-num-ticks="4"
        :x-num-ticks="7"
        :y-grid-line="true"
        :legend-position="LegendPosition.Top"
        :hide-legend="false"
        :curve-type="CurveType.Step" >
          <template #tooltip="{ values }">
            <div>
              <h2 class="!text-base">Generation {{ getGenName(values?.generation ?? 1) }}</h2>
              <p class="text-sm mt-2">Grow: {{ values?.count }} Unit</p>
              <p class="text-sm">Total: {{ values?.total }} Pokemon</p>
            </div>
          </template>
      </AreaChart>
    </div>
  </div>
</template>

<style scoped lang="postcss">
tspan {
  @apply !bg-red-200;
}
</style>
