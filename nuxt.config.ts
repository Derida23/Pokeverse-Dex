// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true, 
    timeline: {
      enabled: true,
    }, },
  nitro: {
    compressPublicAssets: true,
  },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/google-fonts',
  ],
  imports: {
    dirs: ['composables/api'],
  },
  css: ['@/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      'postcss-hexrgba': {},
      'tailwindcss/nesting': {},
      'tailwindcss': {},
      'postcss-lighten-darken': {},
      'autoprefixer': {},
    },
  },
  googleFonts: {
    preload: true,
    display: 'swap',
    families: {
      'Noto+Sans': {
        wght: '200..900',
        ital: '200..700',
      }
    },
  },
})
