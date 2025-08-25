<script setup lang="ts">
import { generations, status } from '~/constants/filter';

const props = defineProps({
  filter:{
    type: Object,
    required: true
  }
})

const open = reactive({
  status: false,
  gen: false,
})

const selectedStatusLabel = computed(() =>
  status[0].find((item) => item.name == props.filter.status)?.label ?? 'Unknown'
)

const selectedGenLabel = computed(() =>
  generations[0].find(({ id }) => id == props.filter.gen)?.label ?? 'All Gen'
)

const emits = defineEmits(['handle-filter', 'handle-reset' ])

function handleFilter(name: string, value: string | number) {
  emits('handle-filter', name, value )
}

function handleReset() {
  emits('handle-reset')
}
</script>

<template>
  <div class="filter-analytic">
    <div class="col-span-3">
      <UDropdown 
        v-model:open="open.status" 
        :items="status" 
        class="w-full"
        :popper="{offsetDistance: 8, placement: 'bottom-start' }"
        :ui="{
          base: 'max-h-96 overflow-auto',
          item: {
            padding: 'px-0 py-0',
          }
        }">
        <template #item="{ item }">
          <div class="label" @click="handleFilter('status', item.name)">
            <p :class="{ 'label-active': selectedStatusLabel === item.label }">
              {{ item.label }}
            </p>
          </div>
        </template>

        <UButton 
          size="lg"
          block
          color="white" 
          :label="selectedStatusLabel" 
          :trailing-icon="open.status ? 'i-heroicons-chevron-up-20-solid' 
          : 'i-heroicons-chevron-down-20-solid'" />

      </UDropdown>
    </div>

    <div class="col-span-3">
      <UDropdown 
        v-model:open="open.gen" 
        class="w-full"
        :items="generations" 
        :popper="{offsetDistance: 8, placement: 'bottom-start' }"
        :ui="{
          base: 'max-h-96 overflow-auto',
          item: {
            padding: 'px-0 py-0',
          }
        }">
        <template #item="{ item }">
          <div class="label" @click="handleFilter('gen', item.id)">
            <p :class="{ 'label-active': selectedGenLabel === item.label }">
              {{ item.label }}
            </p>
          </div>
        </template>

        <UButton 
          size="lg"
          block
          color="white" 
          :label="filter.gen ? `Gen ${getGenName(filter.gen)}` : selectedGenLabel" 
          :trailing-icon="open.gen ? 'i-heroicons-chevron-up-20-solid' 
          : 'i-heroicons-chevron-down-20-solid'" />
      </UDropdown>
    </div>

    <UButton 
      block
      icon="i-hugeicons-search-remove" 
      color="white" 
      class="reset"
      :class="[{'!text-red-400': filter.gen !== 0 || filter.status !== 'attack'}]"
      @click="handleReset()"/> 
  </div>
</template>

<style scoped lang="postcss">
.filter-analytic {
  @apply grid grid-cols-7 gap-x-2 content-center;
}

.label {
  @apply w-full px-3 py-2 text-left;

  &-active {
    @apply text-sky-500 font-medium;
  }
}

.reset {
  @apply w-10 h-10 text-gray-400 dark:text-gray-400 content-end;
}
</style>
