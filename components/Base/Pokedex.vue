<!-- eslint-disable max-len -->
<script setup lang="ts">
defineProps<{
  title: string,
  description: string
}>()
</script>

<!-- eslint-disable max-len -->
<template>
  <div class="w-full pt-16 flex-col flex-center">
    <img src="@/assets/images/pokedex.png" alt="pokedex" class="w-56 z-10" >
    <div class="bg-slate-100 dark:bg-slate-800 border border-slate-400 rounded-lg -mt-20 w-96 min-h-56 p-3 pt-24 relative">
      <p class="font-semibold mb-2">{{ title }}</p>
      <p class="text-sm">{{ description }}</p>
      <UIcon name="i-ic-twotone-catching-pokemon" class="text-xl absolute bottom-2 right-2 animate-bounce"/>
    </div>
  </div>
</template>
