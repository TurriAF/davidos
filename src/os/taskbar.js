// Barra inferior: línea de commits como lanzador + barra de estado.
import { h, t, state, set, on } from './core.js'
import { icon, icons } from './icons.js'
import { getApps, openIds, isMinimized, focusedId, toggleFromLauncher, open } from './windowManager.js'
import { openPalette } from './palette.js'
import { downloadCV } from './cvdoc.js'
import { hash } from './core.js'

export function initTaskbar(root) {
  const line = h('div', { class: 'tl-line', role: 'toolbar', 'aria-label': 'Apps' })
  const branchBtn = h('button', { class: 'sb-branch', type: 'button', onClick: () => set('branch', state.branch === 'main' ? 'ops' : 'main') })
  const langBtn = h('button', { class: 'sb-btn', type: 'button', onClick: () => set('lang', state.lang === 'es' ? 'en' : 'es') })
  const coffeeBtn = h('button', { class: 'sb-coffee', type: 'button', onClick: () => open('coffee') }, h('span', { class: 'sb-coffee-ico', html: icons.coffee }), h('span', { class: 'sb-meter' }, h('i')))
  const cvBtn = h('button', { class: 'sb-cv', type: 'button', onClick: downloadCV }, h('span', { html: icons.download }), h('span', { class: 'sb-cv-txt' }, 'CV'))
  const clock = h('span', { class: 'sb-clock' })
  const startBtn = h('button', { class: 'tl-start', type: 'button', onClick: () => openPalette() }, h('span', { class: 'tl-logo', html: icons.logo }), h('span', { class: 'tl-k' }, h('kbd', {}, 'Ctrl'), h('kbd', {}, 'K')))

  const bar = h(
    'nav',
    { class: 'taskbar' },
    startBtn,
    h('div', { class: 'tl-wrap' }, line),
    h('div', { class: 'statusbar' }, branchBtn, coffeeBtn, cvBtn, langBtn, clock),
  )
  root.append(bar)

  const order = () => {
    const apps = getApps().filter((a) => a.pinned !== false)
    const rank = { dev: 0, cv: 1, ops: 2, fun: 3, sys: 4 }
    const r = state.branch === 'ops' ? { ops: 0, dev: 1, cv: 2, fun: 3, sys: 4 } : rank
    return apps.sort((a, b) => (r[a.lane] ?? 9) - (r[b.lane] ?? 9))
  }

  function paintLine() {
    const ids = openIds()
    const foc = focusedId()
    line.replaceChildren(
      ...order().map((a) => {
        const isOpen = ids.includes(a.id)
        return h(
          'button',
          {
            class: `tl-node lane-${a.lane}${isOpen ? ' open' : ''}${foc === a.id ? ' focused' : ''}${isOpen && isMinimized(a.id) ? ' min' : ''}`,
            type: 'button',
            'aria-label': t(a.name),
            'aria-pressed': String(isOpen),
            onClick: () => toggleFromLauncher(a.id),
          },
          h('span', { class: 'tl-dot', html: icon(a.icon) }),
          h('span', { class: 'tl-tip' }, t(a.name), ' ', h('code', {}, a.file)),
        )
      }),
    )
  }

  function paintStatus() {
    branchBtn.replaceChildren(h('span', { html: icons.branch }), h('span', {}, state.branch === 'main' ? t({ es: 'Desarrollo', en: 'Development' }) : t({ es: 'Sistemas', en: 'Systems' })))
    branchBtn.title = t({ es: 'Cambiar de perfil: desarrollo ⇄ sistemas', en: 'Switch profile: development ⇄ systems' })
    langBtn.textContent = state.lang === 'es' ? 'ES' : 'EN'
    langBtn.title = t({ es: 'Switch to English', en: 'Cambiar a español' })
    cvBtn.title = t({ es: 'Descargar CV', en: 'Download CV' })
    coffeeBtn.title = `coffee.sys · ${state.caffeine}%`
    coffeeBtn.querySelector('i').style.width = state.caffeine + '%'
    coffeeBtn.classList.toggle('low', state.caffeine <= 15)
  }

  const tick = () => (clock.textContent = new Date().toLocaleTimeString(state.lang, { hour: '2-digit', minute: '2-digit' }))
  tick()
  setInterval(tick, 10000)

  on('windows', paintLine)
  on('branch', () => (paintLine(), paintStatus()))
  on('lang', () => (paintLine(), paintStatus(), tick()))
  on('caffeine', paintStatus)
  paintLine()
  paintStatus()
}
