// Proyectos: lista en memoria (cargada de projects.json) + utilidades.
import initial from '../data/projects.json'
import { emit } from './core.js'

let list = initial

export const getProjects = () => list

export function setProjects(next) {
  list = next
  emit('projects', next)
}

export const imageUrl = (p) => (p?.image ? `${import.meta.env.BASE_URL}projects/${p.image}${p.updated ? `?v=${p.updated}` : ''}` : null)

// Proyecto fijo: el propio DavidOS
export const selfProject = {
  id: 'davidos',
  name: 'davidos',
  title: { es: 'DavidOS', en: 'DavidOS' },
  desc: { es: 'Este sistema operativo. Sí, el que estás usando ahora mismo. Vanilla JS, Vite y Canvas, sin frameworks.', en: 'This operating system. Yes, the one you are using right now. Vanilla JS, Vite and Canvas, no frameworks.' },
  image: 'davidos.webp',
  stack: ['JavaScript', 'Vite', 'Canvas', 'CSS'],
  github: 'https://github.com/TurriAF/davidos',
  demo: null,
  status: 'live',
  self: true,
}

// En desarrollo, la lista real está en disco (el panel la modifica sin recargar Vite)
if (import.meta.env.DEV) {
  fetch('/__projects')
    .then((r) => (r.ok ? r.json() : null))
    .then((l) => Array.isArray(l) && setProjects(l))
    .catch(() => {})
}
