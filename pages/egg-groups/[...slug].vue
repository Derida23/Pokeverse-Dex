<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const params = computed(() => {
  return route.params.slug[0]
})

const { getEgg } = useApiEgg()
const { data } = await getEgg(params.value)
</script>

<template>
  <div>
     <section class="navigation" @click="router.push('/egg-groups')">
      <UIcon name="i-lucide-arrow-left" class="navigation-icon"/>
      <p class="navigation-title">Back to egg groups list</p>
    </section>

    <BaseTitle class="first-letter:uppercase">
      {{ getEggName(params) }}
    </BaseTitle>
    <div class="pokemon">
      <Card :pokemons= data.pokemons />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.pokemon {
  @apply grid w-full md:grid-cols-3 gap-4 lg:gap-2;
}

.navigation {
  @apply flex items-center mb-3 cursor-pointer gap-x-2 w-fit hover:underline;

  &-icon {
    @apply text-xl font-light text-stone-500;
  }

  &-title {
    @apply text-sm font-light text-stone-500;
  }
}
</style>
