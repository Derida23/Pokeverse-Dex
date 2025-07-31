<script setup lang="ts">
const { getTypes } = useApiType()
const { data: types } = await getTypes()

const router = useRouter()

function getColor (skill: string): string {
  return `cursor-pointer bg-skill-${skill}-10`
}
</script>

<template>
  <section>
    <BaseTitle>Pokémon Types</BaseTitle>
    <div class="types">
      <div 
        v-for="(type, id) in types" 
        :key="id"
        class="border rounded-lg"
        :class="getColor(type.name)"
        @click="router.push(`/types/${type.name}`)"
      >
        <div class="types-wrapper">
          <div class="types-icons">
            <div 
              class="icons flex-center"
              :class="`bg-skill-${type.name}`"
            >
              <component 
                :is="`svgo-types-${type.name}`" 
                class="text-white"
              />
            </div>
            <div class="icons-title"> {{ type.name }}</div>
          </div>
          
          <div>
            <p class="titles">{{ type.total_pokemon }} pokemons</p>
            <p class="titles-text">
              ({{ type.single_pokemon }} single-type)
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.types {
  @apply grid grid-cols-2 gap-3;

  &-wrapper {
    @apply flex items-center justify-between p-3;
  }

  &-icons {
    @apply flex items-center gap-x-4;
  }
}

.icons {
  @apply w-10 h-10 rounded-full;

  &-title {
    @apply font-semibold first-letter:uppercase;
  }
}

.titles {
  @apply text-sm text-right text-stone-600;

  &-text {
    @apply mt-1 text-xs italic text-right text-stone-600;
  }
}
</style>
