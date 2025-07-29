<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="information-wrapper">
    <div>
      <UIcon :name="props.icon" class="information-icon" />
      <p class="information-title">{{ props.title }}</p>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.information {
  @apply flex gap-1 p-1 border; 
  @apply rounded-lg  md:flex-col md:gap-1 bg-stone-100;

  &-wrapper {
    @apply flex items-center justify-center w-[108px] h-[82px] bg-white rounded-md;
  }

  &-icon {
    @apply w-full mx-auto text-2xl font-light text-stone-600/80;
  }

  &-title {
    @apply mt-1 text-xs text-center;
  }
}
</style>
