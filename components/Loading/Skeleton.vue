<template>
  <div class="grid grid-cols-3 mt-2 gap-x-2">
    <div class="shadow-sm shimmer border-slate-200 hover:border-slate-300 h-36 rounded-xl"/>
    <div class="shadow-sm shimmer border-slate-200 hover:border-slate-300 h-36 rounded-xl"/>
    <div class="shadow-sm shimmer border-slate-200 hover:border-slate-300 h-36 rounded-xl"/>

  </div>
</template>

<style lang="postcss" scoped>
.shimmer {
  position: relative;
  overflow: hidden;
  background-color: #f0f0f0;
}

.shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150px;
  width: 150px;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { left: -150px; }
  100% { left: 100%; }
}
</style>
