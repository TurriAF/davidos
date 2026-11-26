import { h, t, store } from '../os/core.js'
import { person, skills, summary, whyMe, languages } from '../data/cv.js'
import { icons } from '../os/icons.js'
import { downloadCV } from '../os/cvdoc.js'

let mode = store.get('readme-mode', 'preview')

// Colorea un markdown sencillo línea a línea
function codeLine(line) {
  if (line.startsWith('# ')) return h('span', { class: 'tk-h' }, line)
  if (line.startsWith('## ')) return h('span', { class: 'tk-h2' }, line)
  if (line.startsWith('> ')) return h('span', { class: 'tk-q' }, line)
  if (line.startsWith('- ')) {
    return [h('span', { class: 'tk-p' }, '- '), ...inline(line.slice(2))]
  }
  return inline(line)
}
function inline(s) {
  return s.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g).map((part) => {
    if (/^\*\*/.test(part)) return h('span', { class: 'tk-b' }, part)
    if (/^`/.test(part)) return h('span', { class: 'tk-c' }, part)
    if (/^\[/.test(part)) return h('span', { class: 'tk-l' }, part)
    return part
  })
}

export default {
  id: 'readme',
  file: 'readme.md',
  icon: 'readme',
  lane: 'dev',
  name: { es: 'Sobre mí', en: 'About me' },
  keywords: ['about', 'sobre', 'mi', 'perfil', 'profile', 'david'],
  w: 700,
  h: 640,
  dx: -120,
  dy: -30,
  render(body, ctx) {
    const md = [
      `# ${person.name}`,
      '',
      `> ${t(person.role)} · ${t(person.tagline)}`,
      '',
      `## ${t({ es: 'Sobre mí', en: 'About me' })}`,
      t(person.about),
      '',
      `## ${t({ es: 'Stack', en: 'Stack' })}`,
      `- **dev:** ${skills.dev.map((s) => '`' + s.label + '`').join(' ')}`,
      `- **ops:** ${skills.ops.map((s) => '`' + t(s.label) + '`').join(' ')}`,
      '',
      `## ${t({ es: 'Estado', en: 'Status' })}`,
      `- 📍 ${t(person.location)}`,
      `- 🟢 **${t(person.available)}** ${t({ es: 'para nuevos proyectos', en: 'for new projects' })}`,
      `- ✉️ [${person.email}](mailto:${person.email})`,
    ]

    const tabs = h(
      'div',
      { class: 'seg', role: 'tablist' },
      ['code', 'preview'].map((m) =>
        h(
          'button',
          { type: 'button', role: 'tab', 'aria-selected': String(mode === m), class: mode === m ? 'on' : '', onClick: () => ((mode = m), store.put('readme-mode', m), ctx.rerender()) },
          m === 'code' ? t({ es: '</> Código', en: '</> Code' }) : t({ es: '◉ Vista previa', en: '◉ Preview' }),
        ),
      ),
    )

    let view
    if (mode === 'code') {
      view = h('pre', { class: 'code md' }, md.map((l) => h('div', { class: 'code-l' }, codeLine(l), '\n')))
    } else {
      view = h(
        'div',
        { class: 'readme' },
        h(
          'div',
          { class: 'readme-hero' },
          h('div', { class: 'readme-avatar' }, person.initials),
          h(
            'div',
            {},
            h('p', { class: 'eyebrow' }, h('span', { class: 'ok-dot' }), ' ', t({ es: 'Disponible para incorporación inmediata', en: 'Available to start immediately' }), ' · ', t(person.location)),
            h('h1', {}, 'David ', h('span', { class: 'grad' }, 'Aguilar'), ' Fernández'),
            h('p', { class: 'readme-role' }, t(person.role), ' — ', t(person.tagline)),
          ),
        ),
        h(
          'section',
          { class: 'quick', 'aria-label': t({ es: 'En 30 segundos', en: 'In 30 seconds' }) },
          h('h2', { class: 'quick-title' }, '⏱ ', t({ es: 'En 30 segundos', en: 'In 30 seconds' })),
          h('dl', { class: 'quick-dl' }, summary.map((r) => [h('dt', {}, t(r.k)), h('dd', {}, t(r.v))])),
        ),
        h('p', { class: 'readme-about' }, t(person.about)),
        h('h2', { class: 'readme-h' }, t({ es: '¿Por qué yo?', en: 'Why me?' })),
        h('div', { class: 'why' }, whyMe.map((w, i) => h('div', { class: 'why-card' }, h('span', { class: 'why-n' }, String(i + 1)), h('h3', {}, t(w.t)), h('p', {}, t(w.d))))),
        h('h2', { class: 'readme-h' }, t({ es: 'Idiomas', en: 'Languages' })),
        h('div', { class: 'langs' }, languages.map((l) => h('div', { class: 'lang' }, h('b', {}, t(l.name)), h('span', {}, t(l.level))))),
        h('h2', { class: 'readme-h' }, t({ es: 'Tecnologías', en: 'Technologies' })),
        h(
          'div',
          { class: 'chips' },
          skills.dev.map((s) => h('span', { class: 'chip dev' }, s.label)),
          skills.ops.map((s) => h('span', { class: 'chip ops' }, t(s.label))),
        ),
        h(
          'div',
          { class: 'actions' },
          h('button', { class: 'btn primary', type: 'button', onClick: () => ctx.open('repos') }, h('span', { html: icons.repos }), t({ es: 'Ver proyectos', en: 'See projects' })),
          h('button', { class: 'btn', type: 'button', onClick: () => ctx.open('gitlog') }, h('span', { html: icons.gitlog }), t({ es: 'Trayectoria', en: 'Career' })),
          h('button', { class: 'btn', type: 'button', onClick: downloadCV }, h('span', { html: icons.download }), t({ es: 'Descargar CV', en: 'Download CV' })),
          h('button', { class: 'btn ghost', type: 'button', onClick: () => ctx.open('deploy') }, h('span', { html: icons.deploy }), t({ es: 'Contacto', en: 'Contact' })),
        ),
      )
    }
    body.append(h('div', { class: 'pad' }, h('div', { class: 'toolbar' }, tabs, h('span', { class: 'muted small' }, 'UTF-8 · Markdown')), view))
  },
}
