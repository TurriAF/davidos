// Fondo generativo: un grafo de commits que crece hacia arriba y reacciona al ratón.
import { reducedMotion, on, hash } from './core.js'

export function initWallpaper(canvas) {
  const ctx = canvas.getContext('2d')
  let W = 0
  let H = 0
  let dpr = 1
  let lanes = 6
  let nodes = []
  let edges = []
  let last = [] // último nodo por carril
  let timers = []
  let colors = []
  const mouse = { x: -999, y: -999 }
  let n = 0

  function readColors() {
    const cs = getComputedStyle(document.documentElement)
    colors = ['--accent', '--accent2', '--accent3', '--accent', '--accent2', '--accent3', '--accent'].map((k) => cs.getPropertyValue(k).trim() || '#888')
  }

  const laneX = (l) => ((l + 0.5) * W) / lanes

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2)
    W = canvas.clientWidth
    H = canvas.clientHeight
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const nl = Math.max(4, Math.min(12, Math.round(W / 150)))
    if (nl !== lanes || !nodes.length) {
      lanes = nl
      reset()
    }
  }

  function reset() {
    nodes = []
    edges = []
    last = Array(lanes).fill(null)
    timers = Array.from({ length: lanes }, () => Math.random() * 3)
    // Pre-simular para que el fondo arranque lleno
    for (let i = 0; i < 400; i++) step(0.25)
  }

  function spawn(lane) {
    const node = { lane, x: laneX(lane), y: H + 20, id: hash('c' + n++), born: performance.now() }
    nodes.push(node)
    if (last[lane]) edges.push({ a: last[lane], b: node, lane })
    // A veces, un merge desde otro carril
    if (Math.random() < 0.16) {
      const other = (lane + (Math.random() < 0.5 ? 1 : -1) + lanes) % lanes
      if (last[other] && Math.abs(other - lane) === 1) edges.push({ a: last[other], b: node, lane: other, curve: true })
    }
    last[lane] = node
  }

  function step(dt) {
    const speed = 14
    for (const nd of nodes) {
      nd.y -= speed * dt
      nd.x = laneX(nd.lane)
    }
    for (let l = 0; l < lanes; l++) {
      timers[l] -= dt
      if (timers[l] <= 0) {
        spawn(l)
        timers[l] = 2.2 + Math.random() * 4.5
      }
    }
    nodes = nodes.filter((nd) => nd.y > -40)
    edges = edges.filter((e) => e.b.y > -40)
  }

  function draw() {
    ctx.clearRect(0, 0, W, H)
    ctx.lineWidth = 1.5
    for (const e of edges) {
      const c = colors[e.lane % colors.length]
      ctx.strokeStyle = c
      ctx.globalAlpha = 0.16
      ctx.beginPath()
      ctx.moveTo(e.a.x, e.a.y)
      if (e.curve) {
        const my = (e.a.y + e.b.y) / 2
        ctx.bezierCurveTo(e.a.x, my, e.b.x, my, e.b.x, e.b.y)
      } else ctx.lineTo(e.b.x, e.b.y)
      ctx.stroke()
    }
    // El carril sigue hasta abajo (rama "viva")
    for (let l = 0; l < lanes; l++) {
      if (!last[l]) continue
      ctx.strokeStyle = colors[l % colors.length]
      ctx.globalAlpha = 0.08
      ctx.beginPath()
      ctx.moveTo(last[l].x, last[l].y)
      ctx.lineTo(last[l].x, H + 20)
      ctx.stroke()
    }
    ctx.font = '10px "IBM Plex Mono", monospace'
    for (const nd of nodes) {
      const d = Math.hypot(nd.x - mouse.x, nd.y - mouse.y)
      const near = Math.max(0, 1 - d / 180)
      const c = colors[nd.lane % colors.length]
      ctx.globalAlpha = 0.22 + near * 0.7
      ctx.fillStyle = '#0d0f14'
      ctx.strokeStyle = c
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.arc(nd.x, nd.y, 3.4 + near * 2.4, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      if (near > 0.35) {
        ctx.globalAlpha = near
        ctx.fillStyle = c
        ctx.fillText(nd.id, nd.x + 10, nd.y + 3)
      }
    }
    ctx.globalAlpha = 1
  }

  let prev = performance.now()
  function frame(now) {
    const dt = Math.min(0.1, (now - prev) / 1000)
    prev = now
    if (!document.hidden) {
      step(document.body.classList.contains('decaf') ? dt * 0.25 : dt)
      draw()
    }
    requestAnimationFrame(frame)
  }

  addEventListener('resize', () => {
    resize()
    if (reducedMotion) draw()
  })
  addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect()
    mouse.x = e.clientX - r.left
    mouse.y = e.clientY - r.top
    if (reducedMotion) draw()
  })
  on('branch', () => requestAnimationFrame(() => (readColors(), draw())))

  readColors()
  resize()
  draw()
  if (!reducedMotion) requestAnimationFrame(frame)
}
