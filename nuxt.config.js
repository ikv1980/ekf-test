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
    // '@/assets/css/main.css'
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
    // '@nuxtjs/auth'
    // '@nuxtjs/auth-next'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  auth: {
    strategies: {
      github: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      },
    },
  },
  

  // Переменные окружения (личные)

  // env: {
  //   CLIENT_ID: process.env.CLIENT_ID,
  //   // URL для получения code
  //   URL_AUTORIZE: process.env.URL_AUTORIZE,
  //   // URL для получения tokena пользователя
  //   URL_ACCESS_TOKEN: process.env.URL_ACCESS_TOKEN,
  //   // Настроечные параметры для OAuth
  //   HOMEPAGE_URL: process.env.HOMEPAGE_URL,
  //   CALLBACK_URL: process.env.CALLBACK_URL,
  //   CLIENT_ID: process.env.CLIENT_ID,
  //   CLIENT_SECRET: process.env.CLIENT_SECRET,
  //   PERSONAL_TOKEN: process.env.PERSONAL_TOKEN,
  // }
}
// Переменные окружения (личные)
// const dotenv = require('dotenv')
// dotenv.config()
// module.exports = {
//   env: {
//     CLIENT_ID: process.env.CLIENT_ID,
//     // URL для получения code
//     URL_AUTORIZE: process.env.URL_AUTORIZE,
//     // URL для получения tokena пользователя
//     URL_ACCESS_TOKEN: process.env.URL_ACCESS_TOKEN,
//     // Настроечные параметры для OAuth
//     HOMEPAGE_URL: process.env.HOMEPAGE_URL,
//     CALLBACK_URL: process.env.CALLBACK_URL,
//     CLIENT_ID: process.env.CLIENT_ID,
//     CLIENT_SECRET: process.env.CLIENT_SECRET,
//     PERSONAL_TOKEN: process.env.PERSONAL_TOKEN,
//   }
// }