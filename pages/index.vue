<script setup lang="ts">
</script>

<template>
  <div class="homepage">
    <p class="text-sorry">SORRY</p>
    <div class="text-wrapper">
      <h1 class="font-bold text-slate-800 text-[10rem] md:text-[14rem]">4</h1>
      <img src="/assets/images/pokeball.webp" class="w-40 md:w-48" >
      <h1 class="font-bold text-slate-800 text-[10rem] md:text-[14rem]">4</h1>
    </div>
    <p class="text-not-found">Pokémon not found</p>
    <p class="text-explore">Let’s explore further and catch one!</p>
    <div class="flex items-center justify-center mt-8">
      <UButton 
        color="white" 
        variant="solid" 
        size="xl" 
        class="rounded-full"
        @click="$router.push('/pokemons')"
      >
        Throw Poké Ball 
      </UButton>

    </div>
  </div>
</template>

<style scoped lang="postcss">
.homepage {
  @apply m-auto max-w-96 mt-10;
}

.text {
  &-sorry {
    @apply text-center text-red-600 text-4xl font-bold tracking-[1rem];
  }

  &-wrapper {
    @apply flex items-center justify-center md:-mt-[2rem];
  }

  &-not-found {
    @apply font-semibold tracking-widest text-slate-800 md:-mt-[1rem] text-center text-xl;
  }

  &-explore {
    @apply text-center text-slate-500 font-mono text-xs mt-2;
  }
}

</style>
