// El CV como documento: se usa en el visor PDF, en la vista simple y al imprimir.
import { h, t } from './core.js'
import { toast } from './notify.js'
import { track } from './analytics.js'
import { person, skills, timeline, certs, languages } from '../data/cv.js'
import { getProjects } from './projects.js'

export const PDF_URL = import.meta.env.BASE_URL + 'David_Aguilar_CV.pdf'
export const PDF_NAME = 'David_Aguilar_CV.pdf'

const L = {
  about: { es: 'Perfil', en: 'Profile' },
  exp: { es: 'Experiencia', en: 'Experience' },
  edu: { es: 'Formación', en: 'Education' },
  proj: { es: 'Proyectos', en: 'Projects' },
  skills: { es: 'Tecnologías', en: 'Skills' },
  certs: { es: 'Certificaciones', en: 'Certifications' },
  wip: { es: 'en desarrollo', en: 'in progress' },
}

export function renderDoc() {
  const item = (e) =>
    h(
      'div',
      { class: 'doc-item' },
      h('div', { class: 'doc-item-head' }, h('strong', {}, t(e.title)), h('span', {}, t(e.date))),
      h('div', { class: 'doc-org' }, t(e.org)),
      h('ul', {}, t(e.lines).map((l) => h('li', {}, l))),
    )
  return h(
    'article',
    { class: 'doc' },
    h(
      'header',
      { class: 'doc-head' },
      h('div', {}, h('h1', {}, person.name), h('p', { class: 'doc-role' }, t(person.role)), h('p', { class: 'doc-meta' }, t(person.location))),
      h(
        'div',
        { class: 'doc-contact' },
        h('a', { href: 'mailto:' + person.email }, person.email),
        h('a', { href: person.linkedin, target: '_blank', rel: 'noopener' }, 'LinkedIn'),
        h('a', { href: person.github, target: '_blank', rel: 'noopener' }, 'github.com/' + person.githubUser),
      ),
    ),
    h('section', {}, h('h2', {}, t(L.about)), h('p', {}, t(person.about))),
    h('section', {}, h('h2', {}, t(L.exp)), timeline.filter((e) => e.kind === 'work').map(item)),
    h('section', {}, h('h2', {}, t(L.edu)), timeline.filter((e) => e.kind === 'edu').map(item)),
    h(
      'section',
      {},
      h('h2', {}, t(L.proj)),
      h(
        'ul',
        { class: 'doc-proj' },
        getProjects().map((p) =>
          h(
            'li',
            {},
            h('strong', {}, t(p.title)),
            p.status === 'wip' ? ` (${t(L.wip)})` : '',
            p.stack?.length ? ` (${p.stack.join(', ')})` : '',
            ' · ',
            t(p.desc),
            p.github ? [' ', h('a', { href: p.github, target: '_blank', rel: 'noopener' }, 'GitHub')] : '',
          ),
        ),
      ),
    ),
    h(
      'section',
      {},
      h('h2', {}, t(L.skills)),
      h('p', { class: 'doc-skills' }, [...skills.dev, ...skills.ops].map((s) => t(s.label)).join(' · ')),
    ),
    h('section', {}, h('h2', {}, t({ es: 'Idiomas', en: 'Languages' })), h('p', {}, languages.map((l) => `${t(l.name)}: ${t(l.level)}`).join(' · '))),
    h(
      'section',
      {},
      h('h2', {}, t(L.certs)),
      h(
        'ul',
        {},
        certs.map((c) => h('li', {}, h('strong', {}, c.subject), ' · ', c.issuer, ' · ', t(c.detail), c.date ? ` · ${c.date}` : '')),
      ),
    ),
  )
}

let pdfAvailable
export async function hasPdf() {
  if (pdfAvailable !== undefined) return pdfAvailable
  try {
    const r = await fetch(PDF_URL, { method: 'HEAD', cache: 'no-store' })
    pdfAvailable = r.ok && (r.headers.get('content-type') || '').includes('pdf')
  } catch {
    pdfAvailable = false
  }
  return pdfAvailable
}

export async function downloadCV() {
  track('cv-descarga', 'Descarga del CV')
  if (await hasPdf()) {
    const a = h('a', { href: PDF_URL, download: PDF_NAME })
    document.body.append(a)
    a.click()
    a.remove()
    toast({ es: `${PDF_NAME} descargado · v2026`, en: `${PDF_NAME} downloaded · v2026` }, { icon: '⬇', tone: 'ok' })
  } else {
    printCV()
  }
}

// Sin PDF subido: se imprime el documento generado, y "Guardar como PDF" en el diálogo.
export function printCV() {
  const box = document.getElementById('print-cv')
  box.replaceChildren(renderDoc())
  document.body.classList.add('printing-cv')
  toast({ es: 'Elige "Guardar como PDF" en el diálogo de impresión', en: 'Choose "Save as PDF" in the print dialog' }, { icon: '⎙' })
  addEventListener('afterprint', () => document.body.classList.remove('printing-cv'), { once: true })
  setTimeout(() => window.print(), 60)
}
