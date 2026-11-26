// Login = git checkout. El visitante elige rama: main (desarrollo) u ops (sistemas).
import { h, t, state, set, on } from './core.js'
import { person } from '../data/cv.js'
import { icons } from './icons.js'

export function login(root, { onSimple, onDownload }) {
  return new Promise((resolve) => {
    const clock = h('div', { class: 'login-clock' })
    const date = h('div', { class: 'login-date' })
    const tick = () => {
      const d = new Date()
      clock.textContent = d.toLocaleTimeString(state.lang, { hour: '2-digit', minute: '2-digit' })
      date.textContent = d.toLocaleDateString(state.lang, { weekday: 'long', day: 'numeric', month: 'long' })
    }
    tick()
    const iv = setInterval(tick, 1000 * 15)

    const choose = (branch) => {
      set('branch', branch)
      clearInterval(iv)
      screen.classList.add('out')
      setTimeout(() => screen.remove(), 450)
      resolve(branch)
    }

    const card = (branch, title, sub, extra) =>
      h(
        'button',
        { class: `login-card br-${branch}`, type: 'button', onClick: () => choose(branch) },
        h('span', { class: 'login-title' }, title),
        h('span', { class: 'login-sub' }, sub),
        h('span', { class: 'login-cmd' }, h('i', {}, '$'), ` git checkout `, h('b', {}, branch)),
        extra,
      )

    const content = h('div', { class: 'login-panel' })
    const paint = () => {
      tick()
      content.replaceChildren(
        h('div', { class: 'login-avatar' }, h('span', {}, person.initials)),
        h('h1', { class: 'login-name' }, person.name),
        h('p', { class: 'login-role' }, t(person.role), ' · ', h('span', { class: 'ok-dot' }), ' ', t({ es: 'Disponible para incorporación inmediata', en: 'Available to start immediately' })),
        h('p', { class: 'login-ask' }, t({ es: 'Pulsa para entrar en mi portfolio', en: 'Click to enter my portfolio' })),
        h(
          'div',
          { class: 'login-cards' },
          card(
            'main',
            t({ es: 'Entrar → Desarrollo web', en: 'Enter → Web development' }),
            'Java · PHP · JavaScript · SQL',
            h('span', { class: 'login-badge' }, t({ es: 'recomendado · Enter', en: 'recommended · Enter' })),
          ),
          card('ops', t({ es: 'Ver perfil de sistemas', en: 'View systems profile' }), t({ es: 'Redes · Active Directory · soporte', en: 'Networks · Active Directory · support' })),
        ),
        h('p', { class: 'login-note' }, t({ es: '¿No eres técnico? No pasa nada: todo está explicado en lenguaje claro.', en: "Not technical? No problem: everything is explained in plain language." })),
        h(
          'div',
          { class: 'login-foot' },
          h('button', { class: 'link-btn', type: 'button', onClick: () => set('lang', state.lang === 'es' ? 'en' : 'es') }, h('span', { html: icons.globe }), state.lang === 'es' ? 'English' : 'Español'),
          h('button', { class: 'link-btn strong', type: 'button', onClick: onSimple }, h('span', { html: icons.eye }), t({ es: 'Ver CV directamente', en: 'View CV now' })),
          h('button', { class: 'link-btn strong', type: 'button', onClick: onDownload }, h('span', { html: icons.download }), t({ es: 'Descargar CV (PDF)', en: 'Download CV (PDF)' })),
        ),
      )
    }
    paint()
    on('lang', () => screen.isConnected && paint())

    const screen = h(
      'div',
      { class: 'login' },
      h('div', { class: 'login-top' }, h('span', { class: 'login-os', html: icons.logo }), clock, date),
      content,
    )
    root.append(screen)
    setTimeout(() => content.querySelector('.login-card')?.focus({ preventScroll: true }), 500)

    const onKey = (e) => {
      if (!screen.isConnected) return removeEventListener('keydown', onKey)
      if (document.getElementById('simple')?.hidden === false) return
      if (e.key === 'Enter' && !e.target.closest('button')) choose('main')
    }
    addEventListener('keydown', onKey)
  })
}
