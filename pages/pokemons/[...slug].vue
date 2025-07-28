<!-- eslint-disable max-len -->
<script setup lang="ts">

const route = useRoute()
const pokemonName = computed(() => {
  return route.params.slug[0]
})

const { getPokemon } = useApiPokemon()
const { data } = await getPokemon(pokemonName.value)
const items = [
  [{
    label: 'Profile',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    }
  }]
]

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

</script>

<template>
  <div>
    <BasePokemon :pokemon="data.detail.id" :type="data.detail.type[0]"/>

    <section class="relative z-20">
      <section class="flex justify-between">
        <div>
          <h1 class="mb-1 text-2xl font-semibold first-letter:uppercase">{{ data.detail.name }}</h1>
          <p class="mb-10 text-lg text-stone-700">{{ String(data.detail.id).padStart(4, '0') }}</p>
    
          <div>
            <div 
              v-for="item, id in data.detail.type"
              :key="id">
              <div
                class="flex items-center justify-center w-10 h-10 mt-3 rounded-full" 
                :class="`bg-skill-${getNameTypes(item)}`">
                <component 
                  :is="`svgo-types-${getNameTypes(item)}`" 
                  class="text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="p-1 border rounded-lg bg-stone-100">
          <div class="flex items-center justify-center w-[108px] h-[79px] bg-white rounded-md">
            <div>
              <UIcon 
                name="i-ph-ruler" 
                class="w-full mx-auto text-2xl font-light text-stone-600/80" />
              <p class="mt-1 text-xs text-center">{{ getSize(data.detail.height) }} m</p>
            </div>
          </div>

          <div class="flex items-center justify-center w-[108px] h-[82px] bg-white rounded-md mt-1">
            <div>
              <UIcon 
                name="i-hugeicons-weight-scale" 
                class="w-full mx-auto text-2xl font-light text-stone-600/80" />
              <p class="mt-1 text-xs text-center">{{ getSize(data.detail.weight) }} kg</p>
            </div>
          </div>

          <div class="flex items-center justify-center w-[108px] h-[82px] bg-white rounded-md mt-1">
            <div>
              <div class="flex items-center justify-center gap-x-2">
                <SvgoSymbolsMan class="text-xl text-sky-500"/> 
                <p class="text-center">:</p> 
                <SvgoSymbolsFemale class="text-xl text-pink-500"/>
              </div>
              <div class="flex items-center justify-center gap-x-2">
                <p class="mt-1 text-xs text-center">{{ data.detail.gender.male }}</p>
                <p class="mt-1 text-xs text-center">:</p>
                <p class="mt-1 text-xs text-center">{{ data.detail.gender.female }}</p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-center w-[108px] h-[82px] bg-white rounded-md mt-1">
            <div>
              <UIcon 
                name="i-ph-egg-crack" 
                class="w-full mx-auto text-2xl font-light text-stone-600/80" />
              <p class="mt-1 text-xs text-center">{{ data.detail.egg_cycle }} cycles</p>
            </div>
          </div>
        </div>
      </section>

      <section class="flex items-center justify-between mt-5">
        <div class="flex gap-x-2">
          <UButton block color="black" size="xl" class="w-28"> 
            Catch!
          </UButton>
  
          <UButton color="black" size="xl" class="px-8"> 
            Compare With...
          </UButton>
        </div>

        <UDropdown :items="items" mode="hover" :popper="{ placement: 'top-end' }">
          <UButton 
            size="xl" 
            color="white" 
            label="Forms" 
            class="min-w-[118px]" 
            trailing-icon="i-heroicons-chevron-down-20-solid" />
        </UDropdown>
      </section>
      
      <!-- Evolution Chain -->
      <TypeWrapper >
        <template #title>
          Evolution Chain <UDivider />
        </template>

        <section class="mb-5">
          <div class="grid gap-1 md:grid-cols-3">
    
            <!-- Card 1 -->
            <section v-for="stage, idx in data.evolution?.evolves_to" :key="idx">
              <CardEvolution :evo="stage" :item="false" />
            </section>
    
            <div class="flex flex-col gap-y-3">
              <section 
                v-for="stage, idx in data.evolution?.evolves_to[0].evolves_to" 
                :key="idx">
                <CardEvolution :evo="stage" />
              </section>
            </div>
    
            <div class="flex flex-col gap-y-3">
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

      <section class="grid mt-3 md:grid-cols-2 gap-x-4">
        <div class="h-fit">
          <TypeWrapper class="w-full">
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
                 class="flex items-center justify-between mb-2 text-sm gap-x-2">
                <div class="w-1/4 text-right first-letter:uppercase">
                  <p v-if="item.name === 'hp'">HP</p>
                  <p v-else-if="item.name === 'special-attack'">Sp. Attack</p>
                  <p v-else-if="item.name === 'special-defense'">Sp. Defense</p>
                  <p v-else>{{item.name}}</p>
                </div>

                <div class="relative w-2/3 h-3 ml-2">
                  <div 
                    class="absolute h-full rounded-l-full" 
                    :class="`bg-skill-${getNameTypes(data.detail.type[0])}`"
                    :style="`width: ${(item.base_stat / 255) * 100}%`"/>
                  <div class="w-full h-full rounded-full bg-stone-300"/>
                </div>
                
                <p class="w-10 text-right">{{ item.base_stat }}</p>
              </div>

              <div class="flex items-center justify-end text-sm font-semibold ">
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
              class="mb-3 ml-4 list-disc">
              <li >
                <div>
                  <p class="mb-1 font-semibold first-letter:uppercase">
                    {{ item.name }}
                  </p>
                  <p class="text-sm text-stone-500">{{ item.short_effect }}</p>
                </div>
              </li>
            </ul>

          </TypeWrapper>
          
        </div>
        <div>
          <TypeWrapper>
            <div class="flex mb-4 text-sm">
              <h1 class="w-32 font-medium">Generation:</h1>
              <p>{{getGenName(data.dex.generation) }}</p>
            </div>
            
            <div class="flex mb-4 text-sm">
              <h1 class="w-32 font-medium">Habitat:</h1>
              <p class="first-letter:uppercase">{{data.dex.habitat }}</p>
            </div>
  
            <div class="flex mb-4 text-sm">
              <h1 class="w-32 font-medium">Capture Rate:</h1>
              <p>{{data.dex.capture_rate }}</p>
            </div>
  
            <div class="flex mb-4 text-sm">
              <h1 class="w-32 font-medium">Grow Rate:</h1>
              <p class="first-letter:uppercase">{{data.dex.growth_rate.split("-").join(" ") }}</p>
            </div>
  
            <div class="flex mb-4 text-sm">
              <h1 class="w-32 font-medium">Base Exp:</h1>
              <p>{{data.dex.base_experience }}</p>
            </div>
  
            <div class="flex mb-4 text-sm">
              <h1 class="w-32 font-medium">Base Happiness:</h1>
              <p>{{data.dex.base_happiness }}</p>
            </div>
          </TypeWrapper>
  
          <TypeWrapper>
            <template #title>
              <div class="flex items-center justify-between">
                <div class="w-1/2">
                  <p>Type</p>
                  <UDivider />
                </div>
                
                <div class="flex items-center justify-end w-1/2 gap-x-2">
                  <div 
                    v-for="item in typeList" 
                    :key="item.id" 
                    class="px-2 py-1 border rounded-full"
                    :class="`bg-skill-${item.name}-20 border-${item.name} border` " >
                    <div class="flex items-center gap-x-2">
                      <component 
                        :is="`svgo-types-${item.name}`" 
                        class="w-4 h-4"
                      />
                      <p class="text-sm font-normal first-letter:uppercase">{{ item.name }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <section 
              v-if="data.type.defense.fourth_damage.length > 0" 
              class="px-4 py-3 -ml-4 text-sm border-l-4 bg-red-100/30 border-l-red-600">
                <p class="mb-2">Takes 4× damage from</p>
                <TypeBody :damages="data.type.defense.fourth_damage" />
            </section>
            <section 
              v-if="data.type.defense.double_damage.length > 0" 
              class="px-4 py-3 -ml-4 text-sm border-l-4 bg-red-100/30 border-l-red-600">
                <p class="mb-2">Takes 2× damage from</p>
                <TypeBody :damages="data.type.defense.double_damage" />
            </section>

            <section 
              v-if="data.type.defense.single_damage.length > 0" 
              class="px-4 py-3 pl-5 -ml-4 text-sm">
                <p class="mb-2">Takes 1× damage from</p>
                <TypeBody :damages="data.type.defense.single_damage" />
            </section>

            <section 
              v-if="data.type.defense.half_damage.length > 0" 
              class="px-4 py-3 -ml-4 text-sm border-l-4 bg-green-100/30 border-l-green-600">
                <p class="mb-2">Takes 1⁄2× damage from</p>
                <TypeBody :damages="data.type.defense.half_damage" />
            </section>
            <section 
              v-if="data.type.defense.quarter_damage.length > 0" 
              class="px-4 py-3 -ml-4 text-sm border-l-4 bg-green-100/30 border-l-green-600">
                <p class="mb-2">Takes 1⁄4× damage from</p>
                <TypeBody :damages="data.type.defense.quarter_damage" />
            </section>
          </TypeWrapper>
  
          <TypeWrapper>
            <template #title>
              Breeding<UDivider />
            </template>
  
            <div class="flex mb-4 text-sm">
              <h1 class="w-32 font-medium">Egg Groups:</h1>
              <span v-for="(item, id) in data.breeding.egg_groups" :key="id">
                <span
                  class="text-blue-600 cursor-pointer hover:underline"
                >
                  {{ capitalize(item) }}
                </span>
                <span v-if="id < data.breeding.egg_groups.length - 1" class="mr-1">, </span>
              </span>
            </div>

            <div class="flex mb-4 text-sm">
              <h1 class="w-32 font-medium">Egg Cycle:</h1>
              <p>{{ data.breeding.egg_cycle }} Cycles</p>
            </div>
          </TypeWrapper>
        </div>
      </section>
    </section>
  </div>
</template>
