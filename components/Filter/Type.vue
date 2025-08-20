<script setup lang="ts">
interface DropdownItem {
  label: string,
  name: string,
  id: number
}

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    required: true
  },
  items: {
    type: Array as PropType<DropdownItem[][]>,
    required: true
  },
  pair: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['update:open', 'handlePokemon'])
const open = useVModel(props, 'open', emits)

function handlePokemon (label: string) {
  const type = !props.pair ? 'pokemon' : 'pair'
  emits('handlePokemon', label, type)
}

</script>

<template> <!-- Pokemon Filter -->
  <UDropdown 
    v-model:open="open" 
    :items 
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
        :class="{'text-sky-500 font-medium': type === item.label.toLowerCase()}"
        @click="handlePokemon(item.label)"
      >
        <p>{{ item.label }}</p>
        <component 
          :is="`svgo-types-${item.name}`" 
          class="w-4 h-4"
        />
      </div>
    </template>

    <div class="flex items-center p-2 border rounded-full cursor-pointer gap-x-2">
      <div 
        class="flex items-center justify-center w-8 h-8 rounded-full"
        :class="!type ? 'bg-stone-300 dark:bg-stone-900' : `bg-skill-${type}`"
      >
        <component 
          :is="`svgo-types-${type}`" 
          v-if="type" 
          class="text-white !m-0"
        />
        <UIcon v-else name="i-lucide-plus" class="!m-0 text-xl" />

      </div>
      <div v-if="type" class="flex flex-col">
        <UIcon name="i-lucide-chevron-up"/>
        <UIcon name="i-lucide-chevron-down"/>
      </div>
    </div>
  </UDropdown>
</template>
