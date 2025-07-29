<script setup lang="ts">
  defineProps<{
    damages: { name: string, id: string }[]
    label: string
    borderColor?: string
    bgColor?: string
  }>()
</script>

<template>
  <section
    v-if="damages.length > 0"
    :class="[
      'px-4 py-3 -ml-4 text-sm',
      borderColor && `border-l-4 ${bgColor} ${borderColor}`
    ]"
  >
    <p class="mb-2">{{ label }}</p>
    <TypeBody :damages="damages" />
  </section>
</template>
