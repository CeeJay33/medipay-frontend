// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: '', // overridden by NUXT_PUBLIC_API_BASE in .env
    },
  },

  googleFonts: {
    families: {
      Manrope: [400, 500, 600, 700, 800],
      Inter: [400, 500, 600],
    },
    display: 'swap',
  },

  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
        },
      ],
    },
  },
})