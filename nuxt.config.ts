// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
  },
  devtools: { enabled: false, 
    timeline: {
      enabled: true,
    }, },
  nitro: {
    compressPublicAssets: true,
  },
  runtimeConfig: {
    apiUrl: process.env.NUXT_API_URL,
    public: {
      siteTitle: 'Pokéverse',
    },
  },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/google-fonts',
    'nuxt-svgo',
    'nuxt-charts'
  ],
  imports: {
    dirs: ['composables/api'],
  },
  colorMode: {
    preference: 'system', // or 'light'
    fallback: 'light',
    classSuffix: '',
    // ↓ this helps delay initial render until color mode is determined
    storageKey: 'nuxt-color-mode',
    dataValue: 'lazy',
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
