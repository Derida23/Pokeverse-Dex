<script setup lang="ts">
const props = defineProps({
  list: {
    type: Array as PropType<{name:string, id: string}[]>,
    required: true 
  }
})
</script>

<template>
  <div class="type-category">
    <div 
      v-for="item in props.list" 
      :key="item.id" 
      class="px-2 py-1 border rounded-full"
      :class="`bg-skill-${item.name}-20 border-${item.name} border` " >
      <div class="flex items-center gap-x-2">
        <component 
          :is="`svgo-types-${item.name}`" 
          class="w-4 h-4"
        />
        <p class="text-sm font-normal">{{ capitalize(item.name) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.type {
  @apply flex items-center justify-between;

  &-category {
    @apply flex items-center justify-end w-fit gap-x-2;
  }
}</style>
