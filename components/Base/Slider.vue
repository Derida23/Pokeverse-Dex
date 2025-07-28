
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'

const props = defineProps({
  text: {
    type: Array as PropType<string[]>,
    required: true
  }
})

const current = ref(0)
const [container, slider] = useKeenSlider(
  {
    initial: 0,
    loop: false,
    slideChanged(sliderInstance) {
      current.value = sliderInstance.track.details.rel
    },
  },
  []
)

const dotHelper = computed(() =>
  slider.value ? [...Array(slider.value.track.details.slides.length).keys()] : []
)
</script>

<template>
  <div>
    <div class="navigation-wrapper">
      <div ref="container" class="keen-slider">
        <div 
          v-for="item, id in props.text" 
          :key="id" class="keen-slider__slide text-detail">
          {{ item }}
        </div>
      </div>
    </div>

    <div v-if="slider" class="dots">
      <button
        v-for="(_, idx) in dotHelper"
        :key="idx"
        :class="{ dot: true, active: current === idx }"
        @click="slider.moveToIdx(idx)"
      />
    </div>
  </div>
</template>


<style scoped lang="postcss">
@import 'keen-slider/keen-slider.min.css';

[class^='number-slide'],
[class*=' number-slide'] {
  background: grey;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  color: #fff;
  font-weight: 500;
  height: 200px;
}

.navigation-wrapper {
  @apply relative;
}

.dots {
  @apply flex justify-center;
  padding: 10px 0;
}

.dot {
  @apply cursor-pointer w-[10px] h-[10px] border-none rounded-full mx-1 mt-3;
  background: #c5c5c5;
  padding: 5px;

  @apply hover:bg-stone-400;
}
.dot:focus {
  outline: none;
}
.dot.active {
  @apply bg-stone-700;
  @apply w-6 rounded-xl;
  @apply transition-transform;
}

.text-detail {
  @apply text-sm text-stone-800 first-letter:uppercase;
  @apply !min-w-full;
}

</style>
