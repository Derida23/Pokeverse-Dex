<!-- eslint-disable max-len -->
<script setup lang="ts">
import type { Analytics } from '~/types/responses/Analytics'

const props = defineProps({
  data: {
    type: Object as PropType<Analytics>,
    required: true
  }
})

const radius = 130
const circumference = 2 * Math.PI * radius
const values = ref([props.data.total_general.mythical.count, props.data.total_general.legendary.count])
const segments = values.value.map(v => (v / 100) * circumference)
const colors = ["#8b5cf6", "#E2BF65" ]

const regular = computed(() => {
  return props.data.total_pokemon - props.data.total_general.legendary.count - props.data.total_general.mythical.count
})
</script>

<template>
  <svg viewBox="0 0 400 200" width="400" height="200">
    <circle
      cx="200"
      cy="200"
      r="140"
      fill="transparent"
      :stroke="colors[0]"
      stroke-width="40"
      :stroke-dasharray="`${segments[0]} ${circumference - segments[0]}`"
      stroke-dashoffset="0"
      stroke-linecap="round"
    />

    <circle
      cx="200"
      cy="200"
      r="140"
      fill="transparent"
      :stroke="colors[1]"
      stroke-width="40"
      :stroke-dasharray="`${segments[1]} ${circumference - segments[1]}`"
      :stroke-dashoffset="-segments[0]"
      stroke-linecap="round"
    />
  </svg>

  <div class="donut">
    <div class="legend">
      <span class="text-skill-ground">● Legendary</span>
      <span class="font-bold text-lg">{{ data.total_general.legendary.count }}</span>
    </div>
    <div class="legend">
      <span class="text-violet-500 dark:text-violet-300">● Mythical</span>
      <span class="font-bold text-lg">{{ data.total_general.mythical.count }}</span>
    </div>
    <div class="legend">
      <span class="text-stone-600 dark:text-stone-300">● Regular</span>
      <span class="font-bold text-lg">{{ regular }}</span>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.donut {
  @apply flex justify-center gap-8 mt-4 text-xs;
}

.legend {
  @apply flex flex-col items-center;
}
</style>
