import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: "/backgammon-web/",
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/csrf-token': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
      '/matchmaking/count': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
      '/get-username': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
      '/update-username': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
      '/lobby': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      }
    }
  }
})
