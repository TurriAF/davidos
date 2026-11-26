// Paleta de comandos (Ctrl+K): abrir cualquier app o lanzar una acción escribiendo.
import { h, t } from './core.js'
import { icon } from './icons.js'
import { getApps, open } from './windowManager.js'

let el, input, list, items = [], sel = 0, actions = [], lastFocus

export function initPalette(extraActions) {
  actions = extraActions
  input = h('input', {
    class: 'pal-input',
    type: 'text',
    spellcheck: 'false',
    autocomplete: 'off',
    'aria-label': 'Command',
    onInput: renderList,
    onKeydown: onKey,
  })
  list = h('ul', { class: 'pal-list', role: 'listbox' })
  el = h(
    'div',
    { class: 'palette', hidden: true, onPointerdown: (e) => e.target === el && closePalette() },
    h('div', { class: 'pal-box', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Command palette' }, h('div', { class: 'pal-head' }, h('span', { html: icon('search') }), input, h('kbd', {}, 'Esc')), list),
  )
  document.body.append(el)
  addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      if (!document.querySelector('.desktop-ready')) return
      e.preventDefault()
      el.hidden ? openPalette() : closePalette()
    }
  })
}

function allCommands() {
  const appCmds = getApps().map((a) => ({
    id: 'app:' + a.id,
    icon: a.icon,
    label: t(a.name),
    hint: a.file,
    keywords: [a.id, a.file, t(a.name), ...(a.keywords || [])].join(' ').toLowerCase(),
    run: () => open(a.id),
  }))
  const act = actions.map((a) => ({ ...a, label: t(a.label), hint: t(a.hint), keywords: (t(a.label) + ' ' + (a.keywords || '')).toLowerCase() }))
  return [...act, ...appCmds]
}

export function openPalette(prefill = '') {
  lastFocus = document.activeElement
  el.hidden = false
  input.placeholder = t({ es: 'Escribe un comando o una app… (p. ej. "cv", "repos", "pato")', en: 'Type a command or app… (e.g. "cv", "repos", "duck")' })
  input.value = prefill
  renderList()
  requestAnimationFrame(() => input.focus())
}

export function closePalette() {
  el.hidden = true
  lastFocus?.focus?.()
}

function renderList() {
  const q = input.value.trim().toLowerCase()
  items = allCommands().filter((c) => !q || q.split(/\s+/).every((w) => c.keywords.includes(w) || c.label.toLowerCase().includes(w)))
  sel = 0
  list.replaceChildren(
    ...items.map((c, i) =>
      h(
        'li',
        { class: 'pal-item', role: 'option', 'aria-selected': String(i === sel), onPointerdown: (e) => (e.preventDefault(), runIdx(i)), onPointermove: () => mark(i) },
        h('span', { class: 'pal-ico', html: icon(c.icon) }),
        h('span', { class: 'pal-label' }, c.label),
        h('span', { class: 'pal-hint' }, c.hint || ''),
      ),
    ),
  )
  if (!items.length) list.append(h('li', { class: 'pal-empty' }, t({ es: 'command not found. Prueba "help" en daf-sh 😉', en: 'command not found. Try "help" in daf-sh 😉' })))
}

function mark(i) {
  sel = i
  ;[...list.children].forEach((li, k) => li.setAttribute('aria-selected', String(k === i)))
  list.children[i]?.scrollIntoView({ block: 'nearest' })
}

function runIdx(i) {
  const c = items[i]
  if (!c) return
  closePalette()
  c.run()
}

function onKey(e) {
  if (e.key === 'ArrowDown') (e.preventDefault(), mark(Math.min(items.length - 1, sel + 1)))
  else if (e.key === 'ArrowUp') (e.preventDefault(), mark(Math.max(0, sel - 1)))
  else if (e.key === 'Enter') (e.preventDefault(), runIdx(sel))
  else if (e.key === 'Escape') (e.preventDefault(), closePalette())
}
