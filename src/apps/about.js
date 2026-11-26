import { h, t, state } from '../os/core.js'
import { icons } from '../os/icons.js'
import { person } from '../data/cv.js'

const bootAt = Date.now()
let iv

export default {
  id: 'about',
  desktop: false,
  pinned: false,
  file: 'about-davidos',
  icon: 'about',
  lane: 'sys',
  name: { es: 'Acerca de DavidOS', en: 'About DavidOS' },
  keywords: ['about', 'acerca', 'davidos', 'version', 'sistema'],
  w: 420,
  h: 470,
  noGutter: true,
  render(body) {
    clearInterval(iv)
    const up = h('span', {})
    const tick = () => {
      const s = Math.floor((Date.now() - bootAt) / 1000)
      up.textContent = `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`
    }
    tick()
    iv = setInterval(() => (body.isConnected ? tick() : clearInterval(iv)), 1000)
    const row = (k, v) => [h('dt', {}, k), h('dd', {}, v)]
    body.append(
      h(
        'div',
        { class: 'pad aboutos' },
        h('div', { class: 'about-logo', html: icons.logo }),
        h('h2', {}, 'David', h('b', {}, 'OS')),
        h('p', { class: 'muted' }, 'v1.0 "Almería"'),
        h(
          'dl',
          { class: 'about-dl code small' },
          row('kernel', 'vanilla-js'),
          row('build', 'Vite'),
          row(t({ es: 'rama', en: 'branch' }), state.branch),
          row('uptime', up),
          row(t({ es: 'autor', en: 'author' }), person.name),
          row(t({ es: 'licencia', en: 'license' }), t({ es: 'Contrátame y es tuyo', en: "Hire me and it's yours" })),
        ),
        h('p', { class: 'small muted' }, t({ es: 'Hecho a mano, sin frameworks, con mucho café.', en: 'Handmade, no frameworks, lots of coffee.' })),
      ),
    )
  },
  onClose: () => clearInterval(iv),
}
