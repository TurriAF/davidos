// coffee.sys: la cafeína del sistema baja con el tiempo. A 0, DavidOS va lento.
import { state, set, store, on } from './core.js'
import { toast } from './notify.js'

const DRAIN_EVERY = 4000 // ms por punto, unos 6-7 minutos de 100 a 0

export function initCaffeine() {
  setInterval(() => {
    if (document.hidden || !document.querySelector('.desktop-ready')) return
    set('caffeine', Math.max(0, state.caffeine - 1))
  }, DRAIN_EVERY)
  on('caffeine', (v) => {
    document.body.classList.toggle('decaf', v <= 0)
    if (v === 15) toast({ es: 'Cafeína al 15%. El sistema empieza a bostezar…', en: 'Caffeine at 15%. The system is starting to yawn…' }, { icon: '☕', tone: 'warn' })
  })
}

export function brew() {
  set('caffeine', 100)
  const cups = store.get('cups', 0) + 1
  store.put('cups', cups)
  return cups
}

export const cups = () => store.get('cups', 0)
