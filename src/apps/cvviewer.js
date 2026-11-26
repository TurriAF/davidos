import { h, t } from '../os/core.js'
import { icons } from '../os/icons.js'
import { renderDoc, downloadCV, hasPdf, PDF_NAME, printCV } from '../os/cvdoc.js'

let zoom = 1

export default {
  id: 'cv',
  file: PDF_NAME,
  icon: 'cv',
  lane: 'cv',
  name: { es: 'Mi CV (PDF)', en: 'My CV (PDF)' },
  keywords: ['cv', 'curriculum', 'resume', 'pdf', 'descargar', 'download'],
  w: 680,
  h: 600,
  noGutter: true,
  render(body) {
    const page = h('div', { class: 'pdf-page', style: { '--z': zoom } }, renderDoc())
    const zoomLbl = h('span', { class: 'muted small' }, Math.round(zoom * 100) + '%')
    const setZ = (d) => {
      zoom = Math.max(0.6, Math.min(1.4, +(zoom + d).toFixed(2)))
      page.style.setProperty('--z', zoom)
      zoomLbl.textContent = Math.round(zoom * 100) + '%'
    }
    const note = h('span', { class: 'muted small pdf-note' })
    hasPdf().then((ok) => {
      if (!ok) note.textContent = t({ es: 'Se generará desde este documento', en: 'Will be generated from this document' })
    })
    body.append(
      h(
        'div',
        { class: 'pdf' },
        h(
          'div',
          { class: 'pdf-bar' },
          h('button', { class: 'btn small', type: 'button', onClick: () => setZ(-0.1), 'aria-label': 'Zoom out' }, '−'),
          zoomLbl,
          h('button', { class: 'btn small', type: 'button', onClick: () => setZ(0.1), 'aria-label': 'Zoom in' }, '+'),
          h('span', { class: 'spacer' }),
          note,
          h('button', { class: 'btn small ghost', type: 'button', onClick: printCV }, '⎙ ' + t({ es: 'Imprimir', en: 'Print' })),
          h('button', { class: 'btn small primary', type: 'button', onClick: downloadCV }, h('span', { html: icons.download }), t({ es: 'Descargar', en: 'Download' })),
        ),
        h('div', { class: 'pdf-scroll' }, page),
      ),
    )
  },
}
