<script lang="ts" setup></script>

<template>
  <div class="flex flex-col h-screen">
    <header class="bg-gray-800 text-white p-4">
      <h1 class="text-xl">My Application</h1>
    </header>
    <main class="flex-1 p-4">
      <slot />
    </main>
    <footer class="bg-gray-800 text-white p-4 text-center">
      © 2023 My Application
    </footer>
  </div>
</template>
