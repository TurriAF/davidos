import { h, t, reducedMotion } from '../os/core.js'
import { skills, timeline } from '../data/cv.js'

let timer = null

export default {
  id: 'sysmon',
  file: 'sysmon',
  icon: 'sysmon',
  lane: 'ops',
  name: { es: 'Sistemas', en: 'Systems' },
  keywords: ['sistemas', 'systems', 'ops', 'redes', 'network', 'active directory', 'windows', 'aws', 'soporte', 'support'],
  w: 620,
  h: 480,
  dx: 100,
  dy: -40,
  render(body) {
    clearInterval(timer)
    const procs = skills.ops.map((s, i) => ({ ...s, pid: 1000 + i * 137, cpu: s.level * 18, hist: Array.from({ length: 28 }, () => s.level * 18) }))
    const rows = procs.map((p) => {
      const cpu = h('span', { class: 'proc-cpu' })
      const cv = h('canvas', { class: 'spark', width: 140, height: 28 })
      const el = h(
        'div',
        { class: 'proc' },
        h('span', { class: 'proc-pid muted' }, p.pid),
        h('span', { class: 'proc-name' }, p.name + '.service'),
        h('span', { class: 'proc-label muted' }, t(p.label)),
        cv,
        cpu,
      )
      return { p, el, cpu, cv }
    })
    const draw = () => {
      for (const r of rows) {
        const base = r.p.level * 18
        r.p.cpu = Math.max(4, Math.min(99, base + (Math.random() - 0.5) * 22))
        r.p.hist.push(r.p.cpu)
        r.p.hist.shift()
        r.cpu.textContent = r.p.cpu.toFixed(0) + '%'
        const c = r.cv.getContext('2d')
        const W = r.cv.width
        const H = r.cv.height
        c.clearRect(0, 0, W, H)
        c.strokeStyle = getComputedStyle(r.el).getPropertyValue('--accent2') || '#5ce1e6'
        c.lineWidth = 1.5
        c.beginPath()
        r.p.hist.forEach((v, i) => {
          const x = (i / (r.p.hist.length - 1)) * W
          const y = H - (v / 100) * (H - 4) - 2
          i ? c.lineTo(x, y) : c.moveTo(x, y)
        })
        c.stroke()
      }
    }
    const uptime = timeline
      .filter((e) => e.lane === 'ops')
      .map((e) => h('div', { class: 'uptime' }, h('span', { class: 'ok-dot' }), h('b', {}, t(e.org)), h('span', { class: 'muted' }, ' · ' + t(e.title) + ' · ' + t(e.date))))

    body.append(
      h(
        'div',
        { class: 'pad' },
        h(
          'p',
          { class: 'muted small' },
          t({
            es: 'Procesos en segundo plano: mi faceta de sistemas. No es lo principal, pero siempre está corriendo.',
            en: "Background processes: my systems side. Not the main thing, but it's always running.",
          }),
        ),
        h('div', { class: 'proc head small muted' }, h('span', { class: 'proc-pid' }, 'PID'), h('span', {}, 'PROCESS'), h('span', { class: 'proc-label' }, ''), h('span', {}, 'LOAD'), h('span', { class: 'proc-cpu' }, '%')),
        rows.map((r) => r.el),
        h('h3', { class: 'sub' }, t({ es: 'Uptime en soporte', en: 'Support uptime' })),
        uptime,
      ),
    )
    requestAnimationFrame(draw)
    if (!reducedMotion) timer = setInterval(() => body.isConnected ? draw() : clearInterval(timer), 900)
  },
  onClose() {
    clearInterval(timer)
  },
}
