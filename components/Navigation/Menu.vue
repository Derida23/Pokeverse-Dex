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
  router.push(`/${slug}`)
}

const getMenuItemClass = computed (() => {
  return (slug: string) => [
    'menu-content',
    route?.path.includes(`/${slug}`) && 'menu-content__active' 
  ];
})
</script>

<template>
   <div v-for="(menuGroup, index) in menus" :key="index" class="mb-10">
    <h1 class="menu-title">{{ menuGroup.title }}</h1>
    <ul>
      <li
        v-for="(menu, idx) in menuGroup.menu"
        :key="idx"
        :class="getMenuItemClass(menu.slug)"
        @click="handleMenuClick(menu.slug)">
        <UIcon :name="menu.icon" class="text-lg" />
        <span class="pl-2">{{ menu.name }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="postcss">
.menu {
  &-title {
    @apply pb-2 text-[0.7rem] font-medium;
    @apply tracking-widest text-stone-500;
    @apply uppercase;
  }

  &-content {
    @apply h-10 flex items-center text-sm pl-2;
    @apply text-zinc-500 hover:text-zinc-600 cursor-pointer;
    @apply border-l-[1.5px];

    &__active {
      @apply !text-zinc-700 font-semibold;
      @apply border-l-[1.9px] border-l-zinc-500;
    }
  }
}
</style>
