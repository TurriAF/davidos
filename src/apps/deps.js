import { h, t, sleep, reducedMotion } from '../os/core.js'
import { skills, skillCats } from '../data/cv.js'
import { devToggle, isDevView } from '../os/devview.js'

const LEVEL = { es: ['', 'básico', 'iniciado', 'intermedio', 'avanzado', 'experto'], en: ['', 'basic', 'beginner', 'intermediate', 'advanced', 'expert'] }
let installing = false

// Vista sencilla (por defecto): tarjetas por categoría con nivel en palabras
function renderSimple(body, ctx) {
  const groups = {}
  for (const s of skills.dev) (groups[s.cat] ||= []).push(s)
  groups.ops = skills.ops
  body.append(
    h(
      'div',
      { class: 'pad' },
      h('div', { class: 'toolbar' }, h('p', { class: 'lead' }, t({ es: 'Tecnologías que he aprendido y uso, con mi nivel actual.', en: 'Technologies I have learned and use, with my current level.' })), devToggle('deps', ctx)),
      h(
        'div',
        { class: 'skillgrid' },
        Object.entries(groups).map(([cat, list]) =>
          h(
            'section',
            { class: `skillcard ${cat === 'ops' ? 'ops' : 'dev'}` },
            h('h3', {}, t(skillCats[cat])),
            list.map((s) =>
              h(
                'div',
                { class: 'skillrow' },
                h('span', { class: 'skill-name' }, t(s.label)),
                h('span', { class: 'skill-lvl' }, t(LEVEL)[s.level]),
                h('span', { class: 'dep-bar', 'aria-hidden': 'true' }, h('i', { style: { width: s.level * 20 + '%' } })),
              ),
            ),
          ),
        ),
      ),
      h('p', { class: 'muted small' }, t({ es: 'Escala: básico · iniciado · intermedio · avanzado · experto. Niveles honestos de perfil junior recién titulado.', en: 'Scale: basic · beginner · intermediate · advanced · expert. Honest levels for a recently graduated junior.' })),
    ),
  )
}

export default {
  id: 'deps',
  file: 'package.json',
  icon: 'deps',
  lane: 'dev',
  name: { es: 'Habilidades', en: 'Skills' },
  keywords: ['skills', 'tecnologias', 'stack', 'deps', 'npm', 'java', 'php', 'javascript', 'sql', 'react'],
  w: 620,
  h: 540,
  dx: 60,
  dy: 10,
  render(body, ctx) {
    if (!isDevView('deps')) return renderSimple(body, ctx)
    const row = (s, kind) => {
      const lvl = t(LEVEL)[s.level]
      return h(
        'div',
        { class: `dep ${kind}` },
        h('span', { class: 'dep-name' }, h('span', { class: 'tk-s' }, `"${s.name}"`)),
        h('span', { class: 'dep-ver' }, h('span', { class: 'tk-s' }, `"^${s.level}.0.0"`)),
        h('span', { class: 'dep-bar', title: lvl }, h('i', { style: { width: s.level * 20 + '%' } })),
        h('span', { class: 'dep-lvl' }, lvl),
      )
    }
    const log = h('pre', { class: 'term small', 'aria-live': 'polite' })
    const btn = h('button', { class: 'btn primary', type: 'button', onClick: run }, '▶ npm install')

    async function run() {
      if (installing) return
      installing = true
      btn.disabled = true
      log.textContent = '$ npm install\n'
      const all = [...skills.dev, ...skills.ops]
      for (const s of all) {
        log.textContent += `  + ${s.name}@${s.level}.0.0\n`
        log.scrollTop = log.scrollHeight
        if (!reducedMotion) await sleep(110)
      }
      log.textContent += `\nadded ${all.length} packages, audited ${all.length + 1} packages in 0.9s\n`
      log.textContent += t({ es: '\n0 vulnerabilidades 🎉  (y 1 desarrollador listo para tu equipo)\n', en: '\n0 vulnerabilities 🎉  (and 1 developer ready for your team)\n' })
      log.scrollTop = log.scrollHeight
      installing = false
      btn.disabled = false
    }

    body.append(
      h(
        'div',
        { class: 'pad' },
        h('div', { class: 'toolbar' }, h('span', { class: 'muted small' }, t({ es: 'Cada dependencia es una tecnología que uso', en: 'Every dependency is a technology I use' })), h('div', { class: 'tb-right' }, btn, devToggle('deps', ctx))),
        h(
          'div',
          { class: 'pkg code' },
          h('div', {}, '{'),
          h('div', { class: 'ind' }, h('span', { class: 'tk-k' }, '"name"'), ': ', h('span', { class: 'tk-s' }, '"@david/aguilar-fernandez"'), ','),
          h('div', { class: 'ind' }, h('span', { class: 'tk-k' }, '"description"'), ': ', h('span', { class: 'tk-s' }, `"${t({ es: 'desarrollador web junior', en: 'junior web developer' })}"`), ','),
          h('div', { class: 'ind' }, h('span', { class: 'tk-k' }, '"dependencies"'), ': {', h('span', { class: 'tk-cm' }, t({ es: '  // desarrollo: lo que más uso', en: '  // development: what I use most' }))),
          h('div', { class: 'deps' }, skills.dev.map((s) => row(s, 'dev'))),
          h('div', { class: 'ind' }, '},'),
          h('div', { class: 'ind' }, h('span', { class: 'tk-k' }, '"optionalDependencies"'), ': {', h('span', { class: 'tk-cm' }, t({ es: '  // sistemas: mi otra mitad', en: '  // systems: my other half' }))),
          h('div', { class: 'deps' }, skills.ops.map((s) => row({ ...s, label: t(s.label) }, 'ops'))),
          h('div', { class: 'ind' }, '}'),
          h('div', {}, '}'),
        ),
        log,
      ),
    )
  },
}
