// bugsquash: aplasta bugs antes de que lleguen a producción.
import { h, t, store, reducedMotion } from '../os/core.js'
import { toast } from '../os/notify.js'

const BUG_SVG = `<svg viewBox="0 0 32 32" aria-hidden="true"><g stroke="#1b1f2a" stroke-width="2" stroke-linecap="round"><path d="M10 12L4 9M22 12l6-3M9 17H3M23 17h6M10 22l-5 4M22 22l5 4M13 6l-2-3M19 6l2-3"/></g><ellipse cx="16" cy="18" rx="7.5" ry="9" fill="var(--bug,#ff7b72)" stroke="#1b1f2a" stroke-width="2"/><circle cx="16" cy="8.5" r="4.5" fill="#1b1f2a"/><path d="M16 10v17" stroke="#1b1f2a" stroke-width="1.6"/><circle cx="12.5" cy="16" r="1.5" fill="#1b1f2a"/><circle cx="19.5" cy="20" r="1.5" fill="#1b1f2a"/><circle cx="13" cy="23" r="1.2" fill="#1b1f2a"/></svg>`
const COLORS = ['#ff7b72', '#ffc266', '#b58cff', '#7ee787', '#5ce1e6']
const NAMES = ['NullPointer', 'off-by-one', 'race condition', 'CORS', 'undefined', 'memory leak', 'missing ;', 'infinite loop', '404', 'merge conflict']

// Motor común: bugs que corretean dentro de un contenedor.
function swarm(arena, { onSquash, max = 8 }) {
  const bugs = new Set()
  let raf = 0
  let prev = performance.now()
  function spawn() {
    if (bugs.size >= max) return
    const W = arena.clientWidth
    const H = arena.clientHeight
    if (W < 60 || H < 60) return
    const el = h('button', { class: 'bug', type: 'button', 'aria-label': 'bug', html: BUG_SVG })
    el.style.setProperty('--bug', COLORS[Math.floor(Math.random() * COLORS.length)])
    const b = { el, x: Math.random() * (W - 40), y: Math.random() * (H - 40), a: Math.random() * Math.PI * 2, v: 70 + Math.random() * 110, dead: false }
    el.title = NAMES[Math.floor(Math.random() * NAMES.length)]
    el.addEventListener('pointerdown', (e) => {
      e.stopPropagation()
      e.preventDefault()
      if (b.dead) return
      b.dead = true
      el.classList.add('splat')
      onSquash?.(b)
      setTimeout(() => (el.remove(), bugs.delete(b)), 450)
    })
    arena.append(el)
    bugs.add(b)
    place(b)
  }
  function place(b) {
    b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${b.a + Math.PI / 2}rad)`
  }
  function frame(now) {
    const dt = Math.min(0.05, (now - prev) / 1000)
    prev = now
    const W = arena.clientWidth - 36
    const H = arena.clientHeight - 36
    for (const b of bugs) {
      if (b.dead) continue
      b.a += (Math.random() - 0.5) * 3 * dt
      b.x += Math.cos(b.a) * b.v * dt
      b.y += Math.sin(b.a) * b.v * dt
      if (b.x < 0 || b.x > W) (b.a = Math.PI - b.a), (b.x = Math.max(0, Math.min(W, b.x)))
      if (b.y < 0 || b.y > H) (b.a = -b.a), (b.y = Math.max(0, Math.min(H, b.y)))
      place(b)
    }
    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)
  return {
    spawn,
    alive: () => [...bugs].filter((b) => !b.dead).length,
    stop() {
      cancelAnimationFrame(raf)
      bugs.forEach((b) => b.el.remove())
      bugs.clear()
    },
  }
}

// ---- Minijuego ----
let game = null

function stopGame() {
  if (!game) return
  clearInterval(game.iv)
  clearInterval(game.sp)
  game.sw.stop()
  game = null
}

export default {
  id: 'bugsquash',
  persistent: true,
  file: 'bugsquash',
  icon: 'bug',
  lane: 'fun',
  name: { es: 'Minijuego', en: 'Mini-game' },
  keywords: ['bug', 'bugs', 'juego', 'game', 'squash', 'aplastar'],
  w: 600,
  h: 480,
  dx: -140,
  dy: 30,
  noGutter: true,
  render(body) {
    stopGame()
    const best = store.get('bug-best', 0)
    const score = h('b', {}, '0')
    const time = h('b', {}, '30')
    const arena = h('div', { class: 'arena' })
    const overlay = h(
      'div',
      { class: 'arena-ov' },
      h('div', { class: 'arena-big', html: BUG_SVG }),
      h('h2', {}, 'BugSquash'),
      h('p', { class: 'muted' }, t({ es: 'Hay bugs escapándose a producción. Tienes 30 segundos para aplastar todos los que puedas.', en: 'Bugs are escaping to production. You have 30 seconds to squash as many as you can.' })),
      h('p', { class: 'small muted' }, t({ es: 'Récord', en: 'Best' }), `: ${best}`),
      h('button', { class: 'btn primary big', type: 'button', onClick: start }, '▶ ' + t({ es: 'Empezar', en: 'Start' })),
    )
    arena.append(overlay)

    function start() {
      stopGame()
      overlay.hidden = true
      let s = 0
      let left = 30
      score.textContent = '0'
      time.textContent = '30'
      const sw = swarm(arena, { max: 9, onSquash: () => (score.textContent = String(++s)) })
      for (let i = 0; i < 4; i++) sw.spawn()
      game = {
        sw,
        sp: setInterval(() => sw.spawn(), reducedMotion ? 900 : 550),
        iv: setInterval(() => {
          time.textContent = String(--left)
          if (left <= 0) end(s)
        }, 1000),
      }
    }
    function end(s) {
      stopGame()
      const prevBest = store.get('bug-best', 0)
      const record = s > prevBest
      if (record) store.put('bug-best', s)
      overlay.replaceChildren(
        h('h2', {}, `${s} bugs ${t({ es: 'resueltos', en: 'fixed' })}`),
        h('p', { class: 'muted' }, s >= 25 ? t({ es: '0 bugs en producción. David approves ✅', en: '0 bugs in production. David approves ✅' }) : s >= 12 ? t({ es: 'Nada mal. El QA te invita a un café.', en: 'Not bad. QA buys you a coffee.' }) : t({ es: 'Algunos llegaron a producción… el lunes será largo.', en: 'Some reached production… Monday will be long.' })),
        record ? h('p', { class: 'ok' }, '🏆 ' + t({ es: '¡Nuevo récord!', en: 'New record!' })) : h('p', { class: 'small muted' }, t({ es: 'Récord', en: 'Best' }) + ': ' + prevBest),
        h('button', { class: 'btn primary big', type: 'button', onClick: start }, '↻ ' + t({ es: 'Otra vez', en: 'Again' })),
      )
      overlay.hidden = false
    }

    body.append(
      h(
        'div',
        { class: 'bugapp' },
        h('div', { class: 'bug-hud code small' }, h('span', {}, 'fixed: ', score), h('span', {}, 'time: ', time, 's'), h('span', { class: 'muted' }, 'env: production')),
        arena,
      ),
    )
  },
  onClose: stopGame,
}

// ---- Incidente: si dejas el escritorio quieto, aparecen bugs sueltos ----
let incident = null
export function startIncident(root) {
  if (incident || reducedMotion) return
  const layer = h('div', { class: 'incident-layer' })
  root.append(layer)
  let n = 0
  const total = 3
  const sw = swarm(layer, {
    max: total,
    onSquash: () => {
      if (++n >= total) {
        toast({ es: 'INC-0042 resuelto. Buen trabajo, on-call 🧯', en: 'INC-0042 resolved. Nice work, on-call 🧯' }, { icon: '✓', tone: 'ok' })
        setTimeout(() => {
          sw.stop()
          layer.remove()
          incident = null
        }, 500)
      }
    },
  })
  for (let i = 0; i < total; i++) sw.spawn()
  incident = sw
  toast({ es: 'INC-0042: ¡bugs sueltos en el escritorio! Aplástalos 🐛', en: 'INC-0042: bugs loose on the desktop! Squash them 🐛' }, { icon: '!', tone: 'warn', ms: 5000 })
}
