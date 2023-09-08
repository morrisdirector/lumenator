import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    outDir: '../data/build',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        name: 'lumenator',
        assetFileNames: 'lumenator.[ext]',
        entryFileNames: 'lumenator.js'
      }
    }
  }
})
