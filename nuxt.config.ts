// https://nuxt.com/docs/api/configuration/nuxt-config
import path from "node:path";

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: import.meta.dev ? '/favicon_dev.ico' : '/favicon.ico'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css'
        }
      ]
    }
  },
  compatibilityDate: '2024-04-03',
  devtools: {enabled: false},
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
  content: {
    build: {
      markdown: {
        highlight: false
      }
    }
  },
  fonts: {
    families: [
      {
        name: 'Rubik',
        weights: [300, 400, 500, 700], // this is Rubik Light
      },
    ],
  },
  modules: [
    '@nuxt/content',
    'vuetify-nuxt-module',
    '@nuxt/fonts',
    '@nuxt/image',
    'nuxt-umami'
  ],
  umami: {
    id: 'b52fc512-6ecd-4be3-bdd5-39d566b4229d',
    host: 'https://cloud.umami.is',
    autoTrack: true,
  },
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: "dark",
        themes: {
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