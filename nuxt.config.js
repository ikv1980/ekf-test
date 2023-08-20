export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'ekf-nuxt',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/node_modules/bootstrap/dist/css/bootstrap.min.css',
    '@/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxt/http',
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  // Переменные окружения (личные)
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
    // URL для получения code
    URL_AUTORIZE: process.env.URL_AUTORIZE,
    SCOPE: process.env.SCOPE,
    // URL для получения tokena пользователя
    URL_ACCESS_TOKEN: process.env.URL_ACCESS_TOKEN,
    // Настроечные параметры для GitHub OAuth
    HOMEPAGE_URL: process.env.HOMEPAGE_URL,
    REDIRECT_URI: process.env.REDIRECT_URI,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_PERSONAL_TOKEN: process.env.GITHUB_PERSONAL_TOKEN,
  },
}