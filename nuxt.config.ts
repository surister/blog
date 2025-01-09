// https://nuxt.com/docs/api/configuration/nuxt-config
import path from "node:path";

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  nitro: {
    output: {
      publicDir: path.join(__dirname, 'deploy/.dist'),
      serverDir: path.join(__dirname, 'deploy/.dist')
    }
  },
  vue: {
    compilerOptions: {
      whitespace: "preserve"
    }
  },
  modules: [
    '@nuxt/content',
    'vuetify-nuxt-module',
    '@nuxt/fonts',
    '@nuxt/image',
    'nuxt-toc'
  ],
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: "dark",
        themes: {
          darku: {
            colors: {
              background: "#09090b"
            }
          },
          dark: {
            colors: {
              background: "#1c1b22",
              surface: '#09090b',
              primary: '#19c0ea',
              secondary: '#00375a',
            }
          }
        },
      },
    }
  }
})