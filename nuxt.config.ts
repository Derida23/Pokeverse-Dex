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
    '@nuxt/eslint',
  ],
})
