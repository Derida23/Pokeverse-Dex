<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { menus } from '@/constants/menus'

const router = useRouter();
const route = useRoute()
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])
const isOpen = useVModel(props, 'modelValue', emit)

function handleMenuClick(slug: string) {
  isOpen.value = false;
  router.push({ name: slug });
}

const getMenuItemClass = computed (() => {
  return (slug: string) => [
    'menu-content',
    route?.path.includes(slug) && 'menu-content__active' 
  ];
})
</script>

<template>
  <footer class="footer">
    <div class="footer-wrapper">
      <div
        v-for="(menu, idx) in menus[0].menu" :key="idx" 
        class="menu-wrapper"
        @click="handleMenuClick(menu.slug)"
      >
        <div :class="getMenuItemClass(menu.slug)">
          <UIcon :name="menu.icon" class="text-2xl" />
          <span class="mt-1">{{ menu.name }}</span>
        </div>
      </div>
      <div class="menu-wrapper" @click="isOpen = !isOpen">
        <div class="menu-content">
          <UIcon name="i-lucide-sliders-horizontal" class="text-2xl" />
          <p class="mt-1">Menu</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="postcss" scoped>
.footer {
  @apply md:hidden fixed bottom-0 z-[60] bg-white dark:bg-gray-800;
  @apply px-4 h-16 w-full;
  @apply border-t-[1.5px] border-t-slate-200 dark:border-t-slate-700;

  &-wrapper {
    @apply grid grid-cols-5 gap-x-2;
    @apply w-full h-full;
  }
}

.menu {
  &-wrapper {
    @apply flex justify-center items-center;
    @apply cursor-pointer h-full;
  }

  &-title {
    @apply text-[0.7rem] font-medium;
    @apply tracking-widest text-stone-500 dark:text-stone-200;
    @apply uppercase;
  }

  &-content {
    @apply text-xs;
    @apply text-zinc-500 dark:text-zinc-200 hover:text-zinc-600 cursor-pointer;
    @apply flex flex-col items-center justify-center;
    @apply w-full h-full;

    &__active {
      @apply !text-zinc-700 dark:!text-zinc-200 font-semibold;
      @apply bg-slate-100 dark:bg-slate-500/20; 
      @apply border-t-[1.9px] border-t-zinc-500 dark:border-t-zinc-200;
    }
  }
}
</style>
