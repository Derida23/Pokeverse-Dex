<script setup lang="ts">
const router = useRouter()

const props = defineProps({
  breeding: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="flex mb-4 text-sm">
    <h1 class="w-32 font-medium">Egg Groups:</h1>
    <span 
      v-for="(item, id) in props.breeding.egg_groups" 
      :key="id"
      @click="router.push(`/egg-groups/${item}`)">
      <span
        class="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
      >
        {{ capitalize(item) }}
      </span>
      <span v-if="id < breeding.egg_groups.length - 1" class="mr-1">, </span>
    </span>
  </div>

  <div class="flex mb-4 text-sm">
    <h1 class="w-32 font-medium">Egg Cycle:</h1>
    <p>{{ breeding.egg_cycle }} Cycles</p>
  </div>
</template>
