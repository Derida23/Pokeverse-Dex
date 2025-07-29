<script setup lang="ts">
const props = defineProps({
  data: {
    type: Array as PropType<{title: string, description: string}[]>,
    required: true
  }
})
</script>

<template>
  <div v-for="item, id in props.data" :key="id">
    <div class="flex mb-4 text-sm">
      <h1 class="w-32 font-medium">{{ item.title }}:</h1>
      <p>{{item.description }}</p>
    </div>
  </div>
</template>
