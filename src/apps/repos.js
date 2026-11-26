import { h, t, hash, on } from '../os/core.js'
import { person } from '../data/cv.js'
import { icons } from '../os/icons.js'
import { getProjects, imageUrl, selfProject } from '../os/projects.js'

let current = null // null = galería
let liveCtx = null
on('projects', () => liveCtx?.win?.isConnected && liveCtx.rerender())

const STATUS = {
  live: { es: '● publicado', en: '● live' },
  wip: { es: '◐ en desarrollo', en: '◐ in progress' },
}

const all = () => [...getProjects(), selfProject]

// Imagen de shots.so o, si no hay, una portada generativa
function cover(p, big = false) {
  const url = imageUrl(p)
  if (url) return h('img', { class: 'cover-img', src: url, alt: t(p.title), loading: 'lazy', decoding: 'async' })
  const n = parseInt(hash(p.id), 16)
  const hue = n % 360
  return h(
    'div',
    { class: `cover-ph${big ? ' big' : ''}`, style: { '--h1': hue, '--h2': (hue + 70) % 360 }, 'aria-hidden': 'true' },
    h('span', { class: 'cover-ph-name' }, p.self ? 'DavidOS' : p.name),
    h('span', { class: 'cover-ph-hash' }, hash(p.id)),
  )
}

function links(p) {
  return [
    p.github
      ? h('a', { class: 'btn primary small', href: p.github, target: '_blank', rel: 'noopener' }, h('span', { html: icons.github }), 'GitHub')
      : h('span', { class: 'btn small disabled' }, h('span', { html: icons.github }), p.self ? t({ es: 'Ya lo estás usando 😄', en: "You're using it 😄" }) : t({ es: 'Pronto en GitHub', en: 'Coming soon' })),
    p.demo ? h('a', { class: 'btn small', href: p.demo, target: '_blank', rel: 'noopener' }, h('span', { html: icons.external }), 'Demo') : null,
  ]
}

export default {
  id: 'repos',
  file: 'repos/',
  icon: 'repos',
  lane: 'dev',
  name: { es: 'Proyectos', en: 'Projects' },
  keywords: ['proyectos', 'projects', 'github', 'repos', 'portfolio', 'peliculas', 'movies', 'pokeapi'],
  w: 820,
  h: 580,
  dx: 40,
  dy: -10,
  noGutter: true,
  render(body, ctx) {
    liveCtx = ctx
    const list = all()
    const p = current && list.find((x) => x.id === current)

    const crumbs = h(
      'div',
      { class: 'repo-crumbs' },
      h('span', { html: icons.github, class: 'crumb-ico' }),
      h('button', { type: 'button', class: 'crumb', onClick: () => ((current = null), ctx.rerender()) }, person.githubUser),
      p ? [h('span', { class: 'muted' }, '/'), h('b', {}, p.name)] : h('span', { class: 'muted small' }, ` · ${list.length} repos`),
      h('span', { class: 'spacer' }),
      h('a', { class: 'btn ghost small', href: person.github, target: '_blank', rel: 'noopener' }, h('span', { html: icons.external }), t({ es: 'Perfil de GitHub', en: 'GitHub profile' })),
    )

    if (!p) {
      const grid = h(
        'div',
        { class: 'gallery' },
        list.map((x, i) =>
          h(
            'article',
            { class: 'pcard', style: { '--i': i } },
            h('button', { type: 'button', class: 'pcard-cover', 'aria-label': t(x.title), onClick: () => ((current = x.id), ctx.rerender()) }, cover(x), h('span', { class: `pcard-st ${x.status}` }, t(STATUS[x.status]))),
            h(
              'div',
              { class: 'pcard-body' },
              h('h3', {}, h('button', { type: 'button', class: 'pcard-title', onClick: () => ((current = x.id), ctx.rerender()) }, t(x.title))),
              h('p', { class: 'pcard-desc' }, t(x.desc)),
              x.stack?.length ? h('div', { class: 'chips' }, x.stack.map((s) => h('span', { class: 'chip dev' }, s))) : null,
              h('div', { class: 'pcard-links' }, links(x)),
            ),
          ),
        ),
      )
      body.append(h('div', { class: 'repos2' }, crumbs, grid))
      return
    }

    body.append(
      h(
        'div',
        { class: 'repos2' },
        crumbs,
        h(
          'div',
          { class: 'pdetail' },
          h('div', { class: 'pdetail-cover' }, cover(p, true)),
          h(
            'div',
            { class: 'pdetail-info' },
            h('span', { class: `repo-badge ${p.status}` }, t(STATUS[p.status])),
            h('h2', { class: 'repo-title' }, t(p.title)),
            h('p', { class: 'repo-desc' }, t(p.desc)),
            p.self ? h('p', { class: 'repo-note' }, t({ es: '↻ Recursión detectada: estás dentro del proyecto.', en: '↻ Recursion detected: you are inside the project.' })) : null,
            p.stack?.length ? [h('h4', { class: 'sub' }, t({ es: 'Tecnologías', en: 'Tech stack' })), h('div', { class: 'chips' }, p.stack.map((s) => h('span', { class: 'chip dev' }, s)))] : null,
            h('div', { class: 'repo-meta' }, h('span', {}, h('code', {}, hash(p.id)), ' · ', t({ es: 'último commit', en: 'latest commit' })), h('span', {}, 'branch: ', h('b', {}, 'main'))),
            h('div', { class: 'actions' }, links(p), h('button', { class: 'btn ghost small', type: 'button', onClick: () => ((current = null), ctx.rerender()) }, '← ' + t({ es: 'Todos', en: 'All' }))),
          ),
        ),
      ),
    )
  },
}
