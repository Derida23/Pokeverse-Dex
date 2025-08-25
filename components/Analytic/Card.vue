<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  desc: {
    type: Number,
    required: true
  }
})
</script>

<template> 
  <div class="card-wrapper">
    <div class="text-center">
      <p class="font-medium">{{ props.title }}</p>
      <h1 class="mt-2 text-2xl font-bold">{{ desc }}</h1>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.card-wrapper {
  @apply border border-dashed shadow-sm p-2 rounded-lg;
}
</style>
