<script setup lang="ts">

const props = defineProps({
  column: {
    type: Array as PropType<{key: string, label: string}[]>,
    required: true
  }
})
</script>

<template>
  <div
    v-for="item, id in props.column" :key="id" 
    class="text-sm font-medium text-center first-letter:uppercase"
    :class="[{'bg-green-300/20': id === 0}, {'bg-red-300/20': (id + 1 ) === props.column.length}]">
    {{ item.key.split("_").join(" ") }}
  </div>
</template>
