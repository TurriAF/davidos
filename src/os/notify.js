import { h, t } from './core.js'

let box

export function toast(message, { icon = '●', tone = 'info', ms = 3800 } = {}) {
  box ||= document.getElementById('toasts')
  const el = h(
    'div',
    { class: `toast toast--${tone}`, role: 'status' },
    h('span', { class: 'toast-icon', 'aria-hidden': 'true' }, icon),
    h('span', { class: 'toast-msg' }, t(message)),
  )
  box.append(el)
  requestAnimationFrame(() => el.classList.add('in'))
  const kill = () => {
    el.classList.remove('in')
    setTimeout(() => el.remove(), 300)
  }
  el.addEventListener('click', kill)
  setTimeout(kill, ms)
  // Máximo 4 a la vez
  while (box.children.length > 4) box.firstElementChild.remove()
}
