<script setup lang="ts">
const props = defineProps({
  damages: {    
    type: Array as PropType<{name: string, id: string}[]>,
    default: () => []
  }
})
</script>

<template>
  <div class="badge">
    <div v-for="damage, id in props.damages" :key="id">
      <div
        class="badge-content"
        :class="`bg-skill-${damage.name}-20 border-${damage.name} border` ">
        {{ damage.name }}
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.badge {
  @apply flex flex-wrap items-start gap-2;

  &-content {
    @apply first-letter:uppercase py-0.5 px-2 rounded-xl text-xs;
  }
}
</style>
