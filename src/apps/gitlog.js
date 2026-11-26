import { h, t, hash, state } from '../os/core.js'
import { timeline, person } from '../data/cv.js'
import { devToggle, isDevView } from '../os/devview.js'

const HEAD = {
  id: 'head', lane: 'main', kind: 'now', tag: 'HEAD → main',
  org: { es: 'Ahora', en: 'Now' },
  title: { es: 'Buscando mi próximo reto como desarrollador', en: 'Looking for my next challenge as a developer' },
  date: { es: 'hoy', en: 'today' },
  msg: { es: 'wip: buscando mi próximo equipo de desarrollo', en: 'wip: looking for my next dev team' },
  lines: {
    es: ['Disponible para incorporarme (presencial en Almería o en remoto)', 'Con ganas de aprender, programar y aportar desde el primer día'],
    en: ['Available to join (on-site in Almería or remote)', 'Eager to learn, code and contribute from day one'],
  },
}

let selected = 'head'

// Vista sencilla (por defecto): línea de tiempo clásica
function renderSimple(body, ctx) {
  const kind = (e) => (e.kind === 'edu' ? t({ es: 'Formación', en: 'Education' }) : t({ es: 'Trabajo', en: 'Work' }))
  body.append(
    h(
      'div',
      { class: 'pad' },
      h('div', { class: 'toolbar' }, h('p', { class: 'lead' }, t({ es: 'Mi trayectoria, de lo más reciente a lo más antiguo.', en: 'My career, from most recent to oldest.' })), devToggle('gitlog', ctx)),
      h(
        'ol',
        { class: 'tline' },
        timeline.map((e) =>
          h(
            'li',
            { class: `tl-item ${e.kind} ${e.lane}` },
            h('span', { class: 'tl-mark', 'aria-hidden': 'true' }),
            h(
              'div',
              { class: 'tl-card' },
              h('div', { class: 'tl-top' }, h('span', { class: `tl-kind ${e.kind}` }, kind(e)), h('span', { class: 'tl-date' }, t(e.date))),
              h('h3', { class: 'tl-title' }, t(e.title)),
              h('p', { class: 'tl-org' }, t(e.org)),
              h('ul', { class: 'tl-lines' }, t(e.lines).map((l) => h('li', {}, l))),
            ),
          ),
        ),
      ),
    ),
  )
}
const X = { main: 14, ops: 34 }
const RH = 44

function graph(i, rows) {
  const last = rows.length - 1
  const r = rows[i]
  const mid = RH / 2
  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg')
  svg.setAttribute('viewBox', `0 0 48 ${RH}`)
  svg.setAttribute('width', '48')
  svg.setAttribute('height', String(RH))
  svg.setAttribute('aria-hidden', 'true')
  const path = (d, cls) => {
    const p = document.createElementNS(ns, 'path')
    p.setAttribute('d', d)
    p.setAttribute('class', cls)
    svg.append(p)
  }
  // Rama main
  if (i > 0) path(`M${X.main} 0V${mid}`, 'g-main')
  if (i < last) path(`M${X.main} ${mid}V${RH}`, 'g-main')
  // Rama ops: sale de main en el primer commit y se fusiona en HEAD
  if (i === last) path(`M${X.main} ${mid}C${X.main} ${mid - 14} ${X.ops} ${mid - 8} ${X.ops} 0`, 'g-ops')
  else if (i === 0) path(`M${X.ops} ${RH}C${X.ops} ${mid + 8} ${X.main} ${mid + 14} ${X.main} ${mid}`, 'g-ops')
  else path(`M${X.ops} 0V${RH}`, 'g-ops')
  const c = document.createElementNS(ns, 'circle')
  c.setAttribute('cx', String(X[r.lane]))
  c.setAttribute('cy', String(mid))
  c.setAttribute('r', r.id === selected ? '6' : '4.5')
  c.setAttribute('class', `g-node ${r.lane}${r.kind === 'now' ? ' now' : ''}`)
  svg.append(c)
  return svg
}

export default {
  id: 'gitlog',
  file: 'experience.log',
  icon: 'gitlog',
  lane: 'dev',
  name: { es: 'Experiencia', en: 'Experience' },
  keywords: ['experiencia', 'experience', 'trabajo', 'work', 'formacion', 'education', 'git', 'log', 'michelin', 'sumatica', 'medac', 'erasmus'],
  w: 760,
  h: 560,
  dx: 20,
  dy: 20,
  render(body, ctx) {
    if (!isDevView('gitlog')) return renderSimple(body, ctx)
    const rows = [HEAD, ...timeline]
    const sel = rows.find((r) => r.id === selected) || HEAD
    const list = h(
      'div',
      { class: 'glog', role: 'list' },
      rows.map((r, i) =>
        h(
          'button',
          { type: 'button', role: 'listitem', class: `glog-row${r.id === sel.id ? ' on' : ''}`, onClick: () => ((selected = r.id), ctx.rerender()) },
          graph(i, rows),
          h('code', { class: 'glog-hash' }, hash(r.id)),
          r.tag ? h('span', { class: `glog-tag ${r.kind}` }, r.tag) : null,
          h('span', { class: 'glog-msg' }, t(r.msg)),
          h('span', { class: `glog-lane ${r.lane}` }, r.lane),
          h('span', { class: 'glog-date' }, t(r.date)),
        ),
      ),
    )
    const detail = h(
      'div',
      { class: 'gdetail code' },
      h('div', {}, h('span', { class: 'tk-y' }, 'commit ' + hash(sel.id) + hash(sel.id + 'x')), sel.tag ? h('span', { class: 'tk-k' }, ` (${sel.tag})`) : null),
      h('div', { class: 'muted' }, `Author: ${person.name}`),
      h('div', { class: 'muted' }, `Date:   ${t(sel.date)}`),
      h('div', { class: 'gd-title' }, t(sel.title)),
      h('div', { class: 'gd-org' }, '@ ', t(sel.org)),
      h(
        'div',
        { class: 'gd-diff' },
        h('div', { class: 'gd-file' }, `diff --git a/cv.md b/cv.md`),
        t(sel.lines).map((l) => h('div', { class: 'add' }, '+ ' + l)),
      ),
    )
    const legend = h(
      'div',
      { class: 'glegend small muted' },
      h('span', {}, h('i', { class: 'lg main' }), 'main · ', t({ es: 'desarrollo y formación', en: 'development & education' })),
      h('span', {}, h('i', { class: 'lg ops' }), 'ops · ', t({ es: 'sistemas y soporte', en: 'systems & support' })),
      h('span', { class: 'glegend-cmd' }, devToggle('gitlog', ctx)),
    )
    body.append(h('div', { class: 'gitlog' }, legend, list, detail))
  },
}
