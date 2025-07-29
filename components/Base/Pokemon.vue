<script setup lang="ts">
import { colors } from '~/constants/colors';
import { types } from '~/constants/types';

const props = defineProps({
  pokemon: {
    type: Number,
    required: true
  },
  type: {
    type: Number,
    required: true
  }
})

const colorName = computed(() => {
  const color = types.find((item) => item.id === props.type)?.name
  return colors[color]
})

function colorNameWithOpacity(opacity: number) {
  const hex = colorName.value.replace('#', '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const show = ref(false)

onMounted(() => {
  show.value = true
})
</script>


<!-- eslint-disable max-len -->
<template>
  <div>
    <div class="relative flex items-center justify-end w-full">
      <svg class="absolute w-[320px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] -top-12 right-0 md:-top-24 md:right-16" viewBox="0 0 100 100">
        <!-- Dashed Tracks (background rings) -->
        <circle
          cx="50"
          cy="50"
          r="45"
          :stroke="colorNameWithOpacity(0.099)"
          stroke-width="0.4"
          stroke-dasharray="0.6 0.6"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="35"
          :stroke="colorNameWithOpacity(0.099)"
          stroke-width="0.3"
          stroke-dasharray="0.7 0.7"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="25"
          :stroke="colorNameWithOpacity(0.099)"
          stroke-width="0.2"
          stroke-dasharray="0.7 0.7"
          fill="none"
        />
  
        <!-- Animated Gradient Rings -->
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#grad)"
          stroke-width="0.4"
          stroke-linecap="round"
          stroke-dasharray="80 220"
          fill="none"
          class="origin-center animate-spin-slow"
        />
        <circle
          cx="50"
          cy="50"
          r="35"
          stroke="url(#grad)"
          stroke-width="0.3"
          stroke-linecap="round"
          stroke-dasharray="60 180"
          fill="none"
          class="origin-center animate-spin-slower"
        />
        <circle
          cx="50"
          cy="50"
          r="25"
          stroke="url(#grad)"
          stroke-width="0.2"
          stroke-linecap="round"
          stroke-dasharray="40 140"
          fill="none"
          class="origin-center animate-spin-reverse"
        />
  
        <!-- Gradient Definition -->
        <defs>
          <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" :stop-color="colorName" stop-opacity="0" />
            <stop offset="40%" :stop-color="colorName" stop-opacity="0.1" />
            <stop offset="100%" :stop-color="colorName" stop-opacity="1" />
          </linearGradient>
        </defs>
      </svg>
      <transition name="slide-in">
        <div v-if="show" class="absolute w-full top-0 md:left-12">
          <img 
            :src="`https://pokemon-img.pages.dev/600x600/${props.pokemon}.webp`" 
            class="w-96">
        </div>
      </transition>
    </div>
  </div>
</template>
<!-- top-0 right-16 w-52 md:w-80 md:top-0 md:right-52 -->

<style scoped>
.slide-in-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-in-enter-active {
  transition: all 0.2s ease-out;
}
.slide-in-enter-to {
  transform: translateX(0);
  opacity: 1;
}

@keyframes spin-slow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spin-slower {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(720deg);
  }
}

@keyframes spin-reverse {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 12s linear infinite;
}

.animate-spin-slower {
  animation: spin-reverse 20s linear infinite;
}

.animate-spin-reverse {
  animation: spin-slower 15s linear infinite;
}
</style>
