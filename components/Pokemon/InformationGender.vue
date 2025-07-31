<script setup lang="ts">
const props = defineProps({
  gender: {
    type: Object,
    required: true
  }
}) 
</script>

<template>
  <div class="information-wrapper flex-center ">
    <div class="information-gender flex-center">
      <SvgoSymbolsMan class="text-xl text-sky-500"/> 
      <p class="text-center">:</p> 
      <SvgoSymbolsFemale class="text-xl text-pink-500"/>
    </div>
    <div class="information-title text-sm information-gender">
      <p>{{ props.gender.male }}</p>
      <p>:</p>
      <p>{{ gender.female }}</p>
    </div>
  </div>
</template>

<style lang="postcss" scoped>

.information {
  @apply flex gap-1 p-1 border; 
  @apply rounded-lg  md:flex-col md:gap-1 bg-stone-100;

  &-wrapper {
    @apply flex-col w-[108px] h-[82px] bg-white rounded-md;
  }

  &-gender {
    @apply flex gap-x-2;
  }
}
</style>
