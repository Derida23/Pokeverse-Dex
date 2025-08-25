<!-- eslint-disable max-len -->
<script setup lang="ts">
const route = useRoute()
const pokemonName = computed(() => {
  return route.params.slug[0]
})
const pokemonForm = computed(() => {
  return route.params.slug[1]
})
const router = useRouter()

const { getPokemon } = useApiPokemon()
const { data } = await getPokemon(pokemonName.value, pokemonForm.value)
const open = ref(false)

const totalStatus = computed(() => 
  data.status.map(item => item.base_stat).reduce((a, b) => a + b, 0)
)

const typeList = computed(() => {
  const type: { name: string, id: string }[] = []

  data.detail.type.forEach((t) => {
    type.push({
      name: getNameTypes(t),
      id: t.toString()
    })
  })

  return type
})

const statNameMap: Record<string, string> = {
  hp: 'HP',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
}

const information = computed(() => {
  const keyNameMap: Record<string, string> = {
    base_experience: 'Base Exp',
  }
  
  const formatValue = (key: string, value: string) => {
    if (key === 'habitat') return capitalize(value.replace(/-/g, ' '))
    if (key === 'growth_rate') return capitalize(value.replace(/-/g, ' '))
    if (key === 'generation') return getGenName(Number(value)) ?? ''

    return value
  }

  return Object.entries(data.dex).map(([key, rawValue]) => {
    const title = keyNameMap[key]
      ?? key.includes('_')
        ? key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : capitalize(key)

    const description = formatValue(key, rawValue.toString())

    return { title, description }
  })
})

const forms = computed(() => {
  const form = [[]] as { label: string, id: number, types: string[] }[][]

  data.form.forEach((item, index) => {
    const sanitize = {
      label: getName(item.form_name),
      types: item.types.map((item) => getNameTypes(item)),
      id: index,
      click: () => {
        if (index === 0) {
          router.push(`/pokemons/${item.form_name}`)
        } else {
          router.push(`/pokemons/${data.form[0].form_name}/${item.form_name}`)
        }
      }
    }

    form[0].push(sanitize)
  })
  return form
})
</script>

<template>
  <div class="w-full">
    <div class="w-2/3 md:w-3/4 ml-auto">
      <BasePokemon :pokemon="data.detail.id" :type="data.detail.type[0]"/>
    </div>

    <section class="relative z-20">
      <section class="justify-between md:flex">
        <!-- Name and type section -->
        <div class="pokemon">
          <section>
            <h1 class="pokemon-name">
              {{ getName(data.detail.name) }}
            </h1>
            <p class="pokemon-id">
              {{ getPokemonId(data.detail.id) }}
            </p>
            <div 
              v-for="item, id in data.detail.type"
              :key="id">
              <div
                class="pokemon-skill flex-center" 
                :class="`bg-skill-${getNameTypes(item)}`">
                <component 
                  :is="`svgo-types-${getNameTypes(item)}`" 
                  class="text-zinc-50 dark:text-zinc-700"
                />
              </div>
            </div>
          </section>
      
          <div v-if="forms[0].length > 1" class="h-fit">
            <UDropdown 
              v-model:open="open"
              class="md:hidden inline"
              :items="forms" 
              :popper="{ placement: 'bottom-end' }"
              :ui="{ width: 'w-fit' }">

              <template #item="{ item }">
                <div class="px-2 py-1">
                  <div class="flex items-center gap-x-2 text-sm">
                    <p class="font-semibold">{{ item.label }}</p>
                    <div class="text-stone-500 dark:text-stone-200">
                      (
                      <span v-for="type, id in item.types" :key="id">{{ type }}
                        <span v-if="id < item.types.length - 1" class="mr-0.5 -ml-0.5">, </span>
                      </span>
                      )
                    </div>
                  </div>
                </div>
              </template>
              
              <UButton 
                size="lg" 
                color="white" 
                label="Forms" 
                trailing-icon="i-heroicons-chevron-down-20-solid"
                class="hover:!bg-white dark:hover:!bg-stone-800" />
            </UDropdown>
          </div>

        </div>

        <!-- Cols information section -->
        <div class="information">
          <PokemonInformation
            icon="i-solar-mirror-right-broken" 
            :title="`${getSize(data.detail.height)} m`" />

          <PokemonInformation
            icon="i-hugeicons-weight-scale" 
            :title="`${getSize(data.detail.weight)} kg`" />

          <PokemonInformationGender :gender="data.detail.gender"/>

          <PokemonInformation
            icon="i-ph-egg-crack" 
            :title="`${data.detail.egg_cycle} cycles`" />
        </div>
      </section>

      <section class="action">
        <div class="flex w-full gap-x-2 h-10 md:h-12">
          <UButton 
            block 
            color="black" 
            class="w-[49%] md:w-28"> 
            Catch!
          </UButton>
  
          <UButton 
            block 
            color="black" 
            class="w-[49%] md:w-44"
            @click="router.push(`/compares?pokemon=${data.detail.name}&source=detail`)"> 
            Compare With...
          </UButton>
        </div>

        <UDropdown 
          v-if="forms[0].length > 1"
          v-model:open="open"
          class="md:inline hidden"
          :items="forms"
          :popper="{ placement: 'top-end' }"
          :ui="{ width: 'w-fit' }">

          <template #item="{ item }">
            <div class="px-2 py-1">
              <div class="flex items-center gap-x-2 text-sm">
                <p class="font-semibold">{{ item.label }}</p>
                <div class="text-stone-500 dark:text-stone-200">
                  (
                  <span v-for="type, id in item.types" :key="id">{{ type }}
                    <span v-if="id < item.types.length - 1" class="mr-0.5 -ml-0.5">, </span>
                  </span>
                  )
                </div>
              </div>
            </div>
          </template>
          
          <UButton 
            size="xl" 
            color="white" 
            label="Forms" 
            class="min-w-[118px] hover:!bg-white dark:hover:!bg-stone-800" 
            :trailing-icon="open ? 'i-heroicons-chevron-up-20-solid' 
            : 'i-heroicons-chevron-down-20-solid'" />
        </UDropdown>
      </section>
      
      <!-- Evolution Chain -->
      <TypeWrapper v-if="data.evolution?.evolves_to[0].evolves_to.length > 0">
        <template #title>
          Evolution Chain <UDivider />
        </template>

        <section class="mb-5">
          <div class="evolution">
    
            <!-- Card 1 -->
            <section v-for="stage, idx in data.evolution?.evolves_to" :key="idx">
              <CardEvolution :evo="stage" :item="false" />
            </section>
    
            <div class="evolution-wrapper">
              <section 
                v-for="stage, idx in data.evolution?.evolves_to[0].evolves_to" 
                :key="idx">
                <CardEvolution :evo="stage" />
              </section>
            </div>
    
            <div class="evolution-wrapper">
              <section 
                v-for="stage, idx in data.evolution?.evolves_to[0]?.evolves_to[0]?.evolves_to 
                ?? []" 
                :key="idx" class="pl-16 md:pl-0">
                <CardEvolution :evo="stage" />
              </section>
            </div>
          </div>
        </section>
      </TypeWrapper>

      <section class="card">
        <div class="h-fit">
          <TypeWrapper>
            <BaseSlider :text="data.text"/>
          </TypeWrapper>

          <TypeWrapper>
            <template #title>
              Status<UDivider />
            </template>

            <div>
              <div 
                v-for="item, id in data.status" 
                :key="id"
                class="card-status">
                <div class="card-status-title">
                  <p>{{ statNameMap[item.name] || item.name }}</p>
                </div>

                <div class="progress">
                  <div 
                    class="progress-active" 
                    :class="`bg-skill-${getNameTypes(data.detail.type[0])}`"
                    :style="`width: ${(item.base_stat / 255) * 100}%`"/>
                  <div class="progress-base"/>
                </div>
                
                <p class="w-10 text-right">{{ item.base_stat }}</p>
              </div>

              <div class="progress-total">
                <p class="pr-1.5 ">Total: </p>
                <p class="w-10 text-right">{{ totalStatus }}</p>
              </div>
            </div>
          </TypeWrapper>

          <TypeWrapper>
            <template #title>
              Abilities<UDivider />
            </template>

            <ul 
              v-for="item in data.abilities" 
              :key="item.id" 
              class="abilities">
              <li >
                <div>
                  <div class="flex gap-x-2">
                    <p class="abilities-title">
                      {{ getName(item.name) }}
                    </p>
                    <p v-if="item.is_hidden">
                      <UBadge color="black">Hidden</UBadge>
                    </p>
                  </div>
                  <p class="text-sm text-stone-500 dark:text-stone-200">{{ item.short_effect }}</p>
                </div>
              </li>
            </ul>
          </TypeWrapper>
          
        </div>
        
        <div class="w-full">
          <TypeWrapper>
            <PokemonDex :data="information" />
          </TypeWrapper>
  
          <TypeWrapper>
            <template #title>
              <div class="flex">
                <div class="w-[80%]">
                  <p>Type</p><UDivider />
                </div>
                
                <PokemonType :list="typeList"/>
              </div>
            </template>

            <PokemonDefense :defense="data.type.defense"/>
          </TypeWrapper>
  
          <TypeWrapper>
            <template #title>
              Breeding<UDivider />
            </template>
  
            <PokemonEgg :breeding="data.breeding"/>
          </TypeWrapper>
        </div>
      </section>
    </section>
  </div>
</template>

<style scoped lang="postcss">
.pokemon {
  @apply h-[250px] md:h-fit flex justify-between;

  &-name {
    @apply mb-1 text-xl md:text-2xl font-semibold first-letter:uppercase;
  }

  &-id {
    @apply mb-10 text-lg text-stone-700 dark:text-stone-200;
  }

  &-skill {
    @apply flex-col w-10 h-10 mt-3 rounded-full;
  }
}

.information {
  @apply flex gap-1 p-1 border; 
  @apply rounded-lg  md:flex-col md:gap-1 bg-stone-100 dark:bg-stone-700;
}

.action {
  @apply flex items-center justify-between mt-5;
}

.evolution {
  @apply grid gap-2 md:grid-cols-3;

  &-wrapper {
    @apply flex flex-col gap-y-3;
  }
}

.card {
  @apply mt-3 md:grid md:grid-cols-2 gap-x-4;

  &-status {
    @apply flex items-center justify-between mb-2 text-sm gap-x-2;

    &-title {
      @apply w-1/4 text-right first-letter:uppercase;
    }
  }
}

.progress {
  @apply relative w-2/3 h-3 ml-2;

  &-active {
    @apply absolute h-full rounded-l-full;
  }

  &-base {
    @apply w-full h-full rounded-full bg-stone-200/50 dark:bg-stone-600/50;
  }

  &-total {
    @apply flex items-center justify-end text-sm font-semibold;
  }
}

.abilities {
  @apply mb-3 ml-4 list-disc;

  &-title {
    @apply mb-1 font-semibold first-letter:uppercase;
  }
}
</style>
