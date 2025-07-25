<script setup lang="ts">
const { getEggs } = useApiEgg()
const { data } = await getEggs()

const router = useRouter()

</script>

<template>
  <div>
    <BaseTitle>Egg Groups</BaseTitle>

    <div class="eggs">
      <div v-for="egg in data" :key="egg.id" >
        <div class="eggs-card" @click="router.push(`/egg-groups/${egg.name}`)">
          <p class="text-center first-letter:uppercase">
            {{ getEggName(egg.name) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.eggs {
  @apply grid grid-cols-1 md:grid-cols-3 gap-4;

  &-card {
    @apply border-dashed border-2 px-5 py-4;
    @apply w-52 hover:border-sky-500 cursor-pointer;
}

}
</style>
