// Guía de bienvenida: 3 pasos para quien no está acostumbrado a "sistemas operativos" de portfolio.
import { h, t, store, isMobile } from '../os/core.js'
import { icons } from '../os/icons.js'
import { downloadCV } from '../os/cvdoc.js'

export const shouldWelcome = () => !store.get('welcomed', false)

export default {
  id: 'welcome',
  file: 'bienvenida',
  icon: 'about',
  lane: 'sys',
  name: { es: 'Bienvenida', en: 'Welcome' },
  keywords: ['ayuda', 'help', 'guia', 'guide', 'bienvenida', 'welcome', 'como', 'how'],
  desktop: false,
  pinned: false,
  noGutter: true,
  w: 540,
  h: 590,
  render(body, ctx) {
    store.put('welcomed', true)
    const step = (n, ico, title, text) =>
      h('li', { class: 'wstep' }, h('span', { class: 'wstep-ico', html: ico }), h('div', {}, h('b', {}, `${n}. ${title}`), h('p', {}, text)))
    body.append(
      h(
        'div',
        { class: 'pad welcome' },
        h('h2', { class: 'section-title' }, '👋 ', t({ es: '¡Hola! Soy David.', en: "Hi! I'm David." })),
        h(
          'p',
          { class: 'lead' },
          t({
            es: 'Este portfolio funciona como un pequeño ordenador. No hace falta saber nada técnico:',
            en: 'This portfolio works like a small computer. No technical knowledge needed:',
          }),
        ),
        h(
          'ol',
          { class: 'wsteps' },
          step(1, icons.readme, t({ es: 'Abre secciones', en: 'Open sections' }), isMobile() ? t({ es: 'Toca un icono: Sobre mí, Experiencia, Proyectos…', en: 'Tap an icon: About me, Experience, Projects…' }) : t({ es: 'Haz clic en un icono del escritorio: Sobre mí, Experiencia, Proyectos…', en: 'Click a desktop icon: About me, Experience, Projects…' })),
          step(2, icons.logo, t({ es: 'Todo a mano abajo', en: 'Everything at the bottom' }), t({ es: 'La barra inferior tiene todas las secciones. Para cerrar una ventana, usa la ×.', en: 'The bottom bar has every section. To close a window, use the ×.' })),
          step(3, icons.download, t({ es: '¿Con prisa?', en: 'In a hurry?' }), t({ es: 'Descarga mi CV en PDF con el botón verde "CV" de abajo a la derecha.', en: 'Download my CV as PDF with the green "CV" button at the bottom right.' })),
        ),
        h(
          'div',
          { class: 'actions' },
          h('button', { class: 'btn primary', type: 'button', onClick: () => (ctx.close(), ctx.open('readme')) }, t({ es: 'Empezar por Sobre mí', en: 'Start with About me' })),
          h('button', { class: 'btn', type: 'button', onClick: () => (ctx.close(), downloadCV()) }, h('span', { html: icons.download }), t({ es: 'Descargar CV', en: 'Download CV' })),
          h('button', { class: 'btn ghost', type: 'button', onClick: () => ctx.close() }, t({ es: 'Explorar por mi cuenta', en: 'Explore on my own' })),
        ),
      ),
    )
  },
}
