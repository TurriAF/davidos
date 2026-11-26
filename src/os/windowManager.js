// Gestor de ventanas de DavidOS: abrir, enfocar, arrastrar, redimensionar, minimizar.
import { h, t, state, on, emit, isMobile } from './core.js'
import { icon } from './icons.js'
import { toast } from './notify.js'

const apps = new Map()
const wins = new Map() // id -> { app, el, body, minimized, maximized }
let desktop
let zTop = 20
let cascade = 0
let decafWarned = false

export function registerApps(list) {
  list.forEach((a) => apps.set(a.id, a))
}
export const getApps = () => [...apps.values()]
export const getApp = (id) => apps.get(id)
export const openIds = () => [...wins.keys()]
export const isMinimized = (id) => wins.get(id)?.minimized
export const focusedId = () => {
  let best = null
  let z = -1
  for (const [id, w] of wins) {
    if (w.minimized) continue
    const zi = +w.el.style.zIndex
    if (zi > z) (z = zi), (best = id)
  }
  return best
}

export function initWindows(root) {
  desktop = root
  on('lang', rerenderAll)
  on('branch', rerenderAll)
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return
    if (document.querySelector('.palette:not([hidden])')) return
    const id = focusedId()
    if (id && wins.get(id).el.contains(document.activeElement)) close(id)
  })
  addEventListener('resize', () => {
    for (const w of wins.values()) clampIntoView(w.el)
  })
}

function ctxFor(id) {
  return {
    open,
    close: () => close(id),
    toast,
    get win() {
      return wins.get(id)?.el
    },
    rerender: () => rerender(id),
  }
}

export function open(id, opts = {}) {
  const app = apps.get(id)
  if (!app) return
  if (wins.has(id)) {
    const w = wins.get(id)
    if (w.minimized) restore(id)
    focus(id)
    app.onReopen?.(w.body, ctxFor(id), opts)
    return
  }
  // Sin cafeína solo cambian los efectos visuales: abrir ventanas nunca se retrasa
  if (state.caffeine <= 0 && !decafWarned) {
    toast({ es: 'Sistema sin cafeína… prepara un café ☕ (coffee.sys)', en: 'System out of caffeine… brew a coffee ☕ (coffee.sys)' }, { icon: 'z', tone: 'warn' })
    decafWarned = true
  }
  if (state.caffeine > 0) decafWarned = false
  build(app, opts)
}

function build(app, opts) {
  const id = app.id
  const body = h('div', { class: 'win-body', tabindex: '-1' })
  const gutter = h('pre', { class: 'win-gutter', 'aria-hidden': 'true' }, Array.from({ length: 300 }, (_, i) => i + 1).join('\n'))
  body.addEventListener('scroll', () => (gutter.scrollTop = body.scrollTop), { passive: true })

  const title = h('span', { class: 'win-file' })
  const btn = (label, cls, fn, sym) =>
    h('button', { class: `win-btn ${cls}`, type: 'button', 'aria-label': label, title: label, onClick: (e) => (e.stopPropagation(), fn()) }, sym)

  const bar = h(
    'header',
    { class: 'win-bar' },
    h('span', { class: 'win-ico', html: icon(app.icon) }),
    title,
    h('span', { class: 'win-branch' }),
    h(
      'div',
      { class: 'win-btns' },
      btn(t({ es: 'Minimizar', en: 'Minimize' }), 'min', () => minimize(id), '−'),
      btn(t({ es: 'Maximizar', en: 'Maximize' }), 'max', () => toggleMax(id), '+'),
      btn(t({ es: 'Cerrar', en: 'Close' }), 'cls', () => close(id), '×'),
    ),
  )
  const grip = h('div', { class: 'win-resize', 'aria-hidden': 'true' })
  const el = h(
    'section',
    { class: `win app-${id} lane-${app.lane || 'dev'}`, role: 'dialog', 'aria-label': app.file, 'data-app': id },
    bar,
    h('div', { class: 'win-main' }, app.noGutter ? null : gutter, body),
    grip,
  )

  // Tamaño y posición en cascada
  const dw = desktop.clientWidth
  const dh = desktop.clientHeight
  const w = Math.min(app.w || 620, dw - 32)
  const hgt = Math.min(app.h || 460, dh - 32)
  const step = (cascade++ % 7) * 28
  const left = opts.x ?? Math.max(12, Math.min(dw - w - 12, (dw - w) / 2 + step - 60 + (app.dx || 0)))
  const top = opts.y ?? Math.max(12, Math.min(dh - hgt - 12, (dh - hgt) / 2 + step - 70 + (app.dy || 0)))
  Object.assign(el.style, { width: w + 'px', height: hgt + 'px', left: left + 'px', top: top + 'px' })

  const rec = { app, el, body, title, minimized: false, maximized: false }
  wins.set(id, rec)
  desktop.append(el)
  el.addEventListener('pointerdown', () => focus(id))
  bar.addEventListener('dblclick', (e) => !e.target.closest('button') && toggleMax(id))
  makeDraggable(el, bar)
  makeResizable(el, grip)
  paint(id)
  focus(id)
  requestAnimationFrame(() => el.classList.add('in'))
  body.focus({ preventScroll: true })
  emit('windows')
}

function paint(id) {
  const w = wins.get(id)
  w.title.replaceChildren(h('b', {}, t(w.app.name)), h('span', { class: 'win-path' }, '~/david/' + w.app.file))
  w.el.querySelector('.win-branch').textContent = state.branch
  w.el.setAttribute('aria-label', t(w.app.name))
  w.body.replaceChildren()
  w.app.render(w.body, ctxFor(id))
}

function rerender(id) {
  if (wins.has(id)) paint(id)
}

function rerenderAll() {
  for (const [id, w] of wins) {
    if (w.app.persistent) {
      w.el.querySelector('.win-branch').textContent = state.branch
      w.app.onLang?.(w.body, ctxFor(id))
    } else paint(id)
  }
}

export function focus(id) {
  const w = wins.get(id)
  if (!w) return
  if (+w.el.style.zIndex !== zTop) w.el.style.zIndex = ++zTop
  for (const [k, o] of wins) o.el.classList.toggle('focused', k === id)
  emit('windows')
}

export function close(id) {
  const w = wins.get(id)
  if (!w) return
  w.app.onClose?.(w.body)
  wins.delete(id)
  w.el.classList.remove('in')
  w.el.classList.add('out')
  setTimeout(() => w.el.remove(), 180)
  emit('windows')
  const next = focusedId()
  if (next) focus(next)
}

export function minimize(id) {
  const w = wins.get(id)
  if (!w) return
  w.minimized = true
  w.el.classList.add('minimized')
  w.el.classList.remove('focused')
  emit('windows')
}

function restore(id) {
  const w = wins.get(id)
  w.minimized = false
  w.el.classList.remove('minimized')
  emit('windows')
}

export function toggleFromLauncher(id) {
  const w = wins.get(id)
  if (!w) return open(id)
  if (w.minimized) {
    restore(id)
    focus(id)
  } else if (focusedId() === id) minimize(id)
  else focus(id)
}

function toggleMax(id) {
  const w = wins.get(id)
  w.maximized = !w.maximized
  w.el.classList.toggle('maximized', w.maximized)
}

export function closeAll() {
  ;[...wins.keys()].forEach(close)
}

function clampIntoView(el) {
  const dw = desktop.clientWidth
  const dh = desktop.clientHeight
  const r = { l: el.offsetLeft, t: el.offsetTop, w: el.offsetWidth }
  el.style.left = Math.max(-r.w + 120, Math.min(dw - 120, r.l)) + 'px'
  el.style.top = Math.max(0, Math.min(dh - 40, r.t)) + 'px'
}

function makeDraggable(el, handle) {
  handle.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('button') || isMobile() || el.classList.contains('maximized')) return
    e.preventDefault()
    const sx = e.clientX
    const sy = e.clientY
    const ox = el.offsetLeft
    const oy = el.offsetTop
    handle.setPointerCapture(e.pointerId)
    el.classList.add('dragging')
    const move = (ev) => {
      el.style.left = ox + ev.clientX - sx + 'px'
      el.style.top = Math.max(0, oy + ev.clientY - sy) + 'px'
    }
    const up = () => {
      el.classList.remove('dragging')
      clampIntoView(el)
      handle.removeEventListener('pointermove', move)
      handle.removeEventListener('pointerup', up)
      handle.removeEventListener('pointercancel', up)
    }
    handle.addEventListener('pointermove', move)
    handle.addEventListener('pointerup', up)
    handle.addEventListener('pointercancel', up)
  })
}

function makeResizable(el, grip) {
  grip.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || isMobile()) return
    e.preventDefault()
    const sx = e.clientX
    const sy = e.clientY
    const ow = el.offsetWidth
    const oh = el.offsetHeight
    grip.setPointerCapture(e.pointerId)
    el.classList.add('dragging')
    const move = (ev) => {
      el.style.width = Math.max(320, ow + ev.clientX - sx) + 'px'
      el.style.height = Math.max(220, oh + ev.clientY - sy) + 'px'
    }
    const up = () => {
      el.classList.remove('dragging')
      grip.removeEventListener('pointermove', move)
      grip.removeEventListener('pointerup', up)
    }
    grip.addEventListener('pointermove', move)
    grip.addEventListener('pointerup', up)
  })
}
