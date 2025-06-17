<script setup lang="ts">
  const isDarkMode = ref(false);
  const isMenuOpen = ref(false);
</script>

<template>
  <header class="header">
    <div class="header-wrapper">
      <div class="header-title">
        <img src="/assets/images/gengar.png" class="w-14" >
        <div class="italic ml-[-0.4rem]">
          <p class="header-description">Pokémon</p>
          <p class="header-description__sub">ポケモン</p>
        </div>
      </div>
      <div class="flex items-center gap-x-4">
        <UToggle
          v-model="isDarkMode"
          on-icon="i-lucide-moon-star"
          off-icon="i-lucide-sun"
          size="lg"
          color="amber"
        />
        <UIcon
          name="i-lucide-sliders-horizontal"
          class="header-navigation" 
          @click="isMenuOpen = !isMenuOpen" 
        />
      </div>
    </div>
  </header>

  <USlideover v-model="isMenuOpen" :ui="{ width: 'w-screen max-w-64' }">
    <div class="px-6 pt-24">
      <NavigationMenu v-model="isMenuOpen" />
    </div>
  </USlideover>

  <NavigationMenuMobile v-model="isMenuOpen" />
</template>

<style scoped lang="postcss">
.header {
  @apply sticky top-0 z-[60];
  @apply bg-white;
  @apply border border-b-[1.5px] border-b-slate-200;

  &-wrapper {
    @apply mx-auto px-5 md:px-10 xl:px-20 h-16 max-w-7xl;
    @apply flex items-center justify-between;
  }

  &-title {
    @apply flex items-center gap-x-0.5;
  }

  &-description {
    @apply font-normal text-lg pl-0.5;

    &__sub{
      @apply font-extrabold text-xl !mt-[-8px];
    }
  }

  &-navigation {
    @apply cursor-pointer text-lg text-zinc-800;
    @apply hidden md:block lg:hidden;
  }
}
</style>
