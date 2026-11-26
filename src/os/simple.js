// Vista simple: el CV en HTML lineal, para lectores de pantalla o reclutadores con prisa.
import { h, t, state, set, on } from './core.js'
import { renderDoc, downloadCV } from './cvdoc.js'
import { icons } from './icons.js'

let el, lastFocus

export function initSimple() {
  el = document.getElementById('simple')
  on('lang', () => !el.hidden && paint())
  addEventListener('keydown', (e) => e.key === 'Escape' && !el.hidden && closeSimple())
}

function paint() {
  el.replaceChildren(
    h(
      'div',
      { class: 'simple-bar' },
      h('button', { class: 'btn', type: 'button', onClick: closeSimple }, '← ' + t({ es: 'Volver a DavidOS', en: 'Back to DavidOS' })),
      h('span', { class: 'spacer' }),
      h('button', { class: 'btn ghost', type: 'button', onClick: () => set('lang', state.lang === 'es' ? 'en' : 'es') }, state.lang === 'es' ? 'EN' : 'ES'),
      h('button', { class: 'btn primary', type: 'button', onClick: downloadCV }, h('span', { html: icons.download }), t({ es: 'Descargar CV', en: 'Download CV' })),
    ),
    h('main', { class: 'simple-doc' }, renderDoc()),
  )
}

export function openSimple() {
  lastFocus = document.activeElement
  paint()
  el.hidden = false
  el.querySelector('button')?.focus()
}

export function closeSimple() {
  el.hidden = true
  lastFocus?.focus?.()
}
