import { defineConfig } from 'vite'
import projects from './vite-plugin-projects.js'

// base relativa: funciona en Netlify, Vercel y GitHub Pages (subcarpeta) sin tocar nada
export default defineConfig({
  base: './',
  plugins: [projects()],
  server: {
    // El panel "Subir proyecto" escribe estos archivos: que no recarguen la página
    watch: { ignored: ['**/src/data/projects.json'] },
  },
})
