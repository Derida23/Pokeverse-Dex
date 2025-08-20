<template>
  <div class="sidebar">
    <div class="flex">
      <nav class="navbar">
       <NavigationMenu />
      </nav>
      <main class="content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.sidebar {
  @apply mx-auto lg:pl-16 xl:pr-14 max-w-7xl;
}
.navbar {
  @apply fixed bottom-12 top-24 lg:pt-2 mt-4 z-[60];
  @apply bg-zinc-50 dark:bg-gray-700;
  @apply w-64;
  @apply overflow-y-auto;
  @apply transition-[right];
  @apply md:top-16 md:z-[63];
  @apply lg:left-[max(0px,calc(50%-35rem))] lg:w-[14.75rem];
  @apply lg:py-9 lg:pl-8 lg:pr-5 lg:shadow-none -right-64;
  @apply border-r-[1.5px] border-r-zinc-200 dark:border-r-zinc-400;
}

.content {
  @apply mx-auto w-full lg:max-w-[56rem] px-3.5 pb-20 pt-8 
    md:px-6 md:pt-9 
    lg:mr-[max(0px,calc(50%-37rem))] lg:w-[calc(100%-10rem)] lg:px-8 lg:py-10
}
</style>
