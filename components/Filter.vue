<script lang="ts" setup>
import type { FilterKey, FilterValue } from '~/types/components/Pokemons';
import { generations, types, forms } from '@/constants/filter'

const props = defineProps({
  filter: {
    type: Object as () => Record<FilterKey, FilterValue>,
    required: true
  },
})

const emits = defineEmits(['handle-filter', 'handle-reset'])

const open = reactive({ generations: false, types: false, attr: false })

function handleFilter(key: FilterKey, value: FilterValue) {
  emits('handle-filter', key, value)
}

function handleReset(key?: FilterKey) {
  emits('handle-reset', key)
}

// Label getters
const selectedGenLabel = computed(() =>
  generations[0].find(({ id }) => id == props.filter.gen)?.label ?? 'Unknown'
)

const selectedTypeLabel = computed(() =>
  types[0].find(({ name }) => name == props.filter.type)?.label ?? 'Unknown'
)

function selectedAttrLabel (value: string) {
  const attrStr = String(props.filter.attr ?? '')
  const isAttr = attrStr.split('.').includes(value)
  
  return isAttr
}
</script>

<template>
  <div class="grid grid-cols-8 md:grid-cols-4 mb-4 gap-y-2 gap-4 md:gap-2">
    <div class="relative col-span-8 md:col-span-1">
      <UInput
        v-model="filter.q as string"
        icon="i-lucide-search"
        size="md"
        color="white"
        :trailing="false"
        placeholder="Search..."
        maxlength="10"
        @update:model-value="handleFilter('q', $event)"
      />
      <div v-if="filter.q" class="absolute top-0 right-0 pr-2 h-9 flex items-center">
        <UButton
          icon="i-lucide-circle-x"
          size="xs"
          color="red"
          square
          variant="soft"
          @click="handleReset('q')"
        />
      </div>
    </div>

    <div class="relative col-span-3 md:col-span-1">
      <UDropdown 
        v-model:open="open.generations" 
        :items="generations" 
        :popper="{ placement: 'bottom-start' }"
        :ui="{
          base: 'max-h-96 overflow-auto',
          item: {
            padding: 'px-0 py-0',
          }
        }"
      >
        <template #item="{ item }">
          <div class="w-full px-3 py-2 text-left" @click="handleFilter('gen', item.id)">
            <p :class="{ 'text-sky-500 font-medium': selectedGenLabel === item.label }">
              {{ item.label }}
            </p>
          </div>
        </template>

        <UButton color="white" class="w-[150px] md:w-[174px] lg:w-[178px] xl:w-[202px] h-9">
          <div class="flex items-center justify-between w-full px-1 font-light text-gray-500">
            <div>
              <p v-if="!filter.gen">Any generations</p>
              <p v-else class="font-medium">{{ selectedGenLabel }}</p>
            </div>
            <div class="flex items-center">
              <UIcon v-if="!open.generations" name="i-lucide-chevron-down" class="text-lg"/>
              <UIcon v-else name="i-lucide-chevron-up" class="text-lg"/>
            </div>
          </div>
        </UButton>
      </UDropdown>

      <div v-if="filter.gen" class="absolute top-0 right-0 pr-2 h-9 flex items-center">
        <UButton
          icon="i-lucide-circle-x"
          size="xs"
          color="red"
          square
          variant="soft"
          @click="handleReset('gen')"
        />
      </div>
    </div>

    <div class="relative col-span-3 md:col-span-1">
      <UDropdown 
        v-model:open="open.types" 
        :items="types" 
        :popper="{ placement: 'bottom-start' }"
        :ui="{
          base: 'max-h-96 overflow-auto',
          item: {
            padding: 'px-0 py-0',
          }
        }"
      >
        <template #item="{ item }">
          <div 
            class="flex items-center justify-between w-full px-3 py-2"  
            :class="{'text-sky-500 font-medium': selectedTypeLabel === item.label}"
            @click="handleFilter('type', item.name)"
          >
            <p>{{ item.label }}</p>
            <component 
              :is="`svgo-types-${item.name}`" 
              class="w-4 h-4"
            />
          </div>
        </template>

        <UButton block color="white" class="w-[150px] md:w-[174px] lg:w-[178px] xl:w-[202px] h-9" >
          <div class="flex items-center justify-between w-full px-1 font-light text-gray-500">
            <div>
              <p v-if="!filter.type">Any types</p>
              <p v-else class="font-medium">{{ selectedTypeLabel }}</p>
            </div>
            <div class="flex items-center">
              <UIcon v-if="!open.types" name="i-lucide-chevron-down" class="text-lg"/>
              <UIcon v-else name="i-lucide-chevron-up" class="text-lg"/>
            </div>
          </div>
        </UButton>
      </UDropdown>

      <div v-if="filter.type" class="absolute top-0 right-0 pr-2 h-9 flex items-center">
        <UButton
          icon="i-lucide-circle-x"
          size="xs"
          color="red"
          square
          variant="soft"
          @click="handleReset('type')"
        />
      </div>
    </div>
    
    <div class="flex items-center justify-between md:gap-2">
      <UPopover v-model:open="open.attr" :ui="{ placement: 'bottom-start' }">
        <UChip :show="filter.attr !== null" class="w-full" size="lg">
          <UButton color="white" size="lg" class="w-10 h-9 w- p-0">
            <div class="flex items-center justify-center w-full">
              <UIcon name="i-lucide-filter" class="text-lg text-gray-500 " />
            </div>
          </UButton>
        </UChip>
        
        <template #panel>
          <div class="w-[192px] p-1">
            <div
              class="button-attr"
              :class="{'text-sky-500 font-medium': !filter.attr}"
              @click="handleFilter('attr', 'all')">All</div>
            <UDivider class="py-1"/>
            <div 
              v-for="attr in forms" :key="attr.id" 
              class="button-attr" 
              @click="handleFilter('attr', attr.value)">
              <div>
                <p :class="{'text-sky-500 font-medium': selectedAttrLabel(attr.value)}">
                  {{ attr.label }}
                </p>
              </div>
            </div>
          </div>
        </template>
        
      </UPopover>

      <UButton variant="link" @click="handleReset()">Reset</UButton>
    </div>
  </div>
  <UDivider class="mb-6"/>
</template>

<style lang="postcss" scoped>
.button-attr {
  @apply flex items-center justify-between w-full px-3 py-2 text-sm;
  @apply text-gray-600 rounded-md cursor-pointer hover:bg-gray-100 hover:text-gray-700;
}
</style>
