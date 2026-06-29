import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      'es-toolkit/compat/get': path.resolve(__dirname, 'src/compat-wrappers/get.js'),
      'es-toolkit/compat/uniqBy': path.resolve(__dirname, 'src/compat-wrappers/uniqBy.js'),
      'es-toolkit/compat/sortBy': path.resolve(__dirname, 'src/compat-wrappers/sortBy.js'),
      'es-toolkit/compat/isPlainObject': path.resolve(__dirname, 'src/compat-wrappers/isPlainObject.js'),
      'es-toolkit/compat/range': path.resolve(__dirname, 'src/compat-wrappers/range.js'),
      'es-toolkit/compat/maxBy': path.resolve(__dirname, 'src/compat-wrappers/maxBy.js'),
      'es-toolkit/compat/minBy': path.resolve(__dirname, 'src/compat-wrappers/minBy.js'),
      'es-toolkit/compat/last': path.resolve(__dirname, 'src/compat-wrappers/last.js'),
      'es-toolkit/compat/omit': path.resolve(__dirname, 'src/compat-wrappers/omit.js'),
      'es-toolkit/compat/sumBy': path.resolve(__dirname, 'src/compat-wrappers/sumBy.js'),
      'es-toolkit/compat/throttle': path.resolve(__dirname, 'src/compat-wrappers/throttle.js')
    }
  }
})