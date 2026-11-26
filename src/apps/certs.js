import { h, t, hash } from '../os/core.js'
import { certs } from '../data/cv.js'

export default {
  id: 'certs',
  file: 'certs.keychain',
  icon: 'certs',
  lane: 'ops',
  name: { es: 'Certificados', en: 'Certificates' },
  keywords: ['certificaciones', 'certifications', 'b1', 'cambridge', 'ingles', 'english', 'aws'],
  w: 560,
  h: 440,
  dx: -60,
  dy: 40,
  render(body) {
    const fp = (s) => (hash(s) + hash(s + '1') + hash(s + '2')).match(/.{2}/g).slice(0, 10).join(':').toUpperCase()
    body.append(
      h(
        'div',
        { class: 'pad' },
        h('p', { class: 'muted small' }, t({ es: 'Llavero de certificados de confianza instalados en este sistema.', en: 'Trusted certificates installed on this system.' })),
        certs.map((c) =>
          h(
            'div',
            { class: 'cert' },
            h('div', { class: 'cert-seal' }, '✓'),
            h(
              'div',
              { class: 'cert-body' },
              h('div', { class: 'cert-title' }, c.subject),
              h('div', { class: 'cert-valid' }, t({ es: 'Certificado válido', en: 'Valid certificate' })),
              h(
                'dl',
                { class: 'cert-dl code small' },
                h('dt', {}, t({ es: 'Emisor', en: 'Issuer' })),
                h('dd', {}, c.issuer),
                h('dt', {}, t({ es: 'Detalle', en: 'Detail' })),
                h('dd', {}, t(c.detail)),
                c.date ? [h('dt', {}, t({ es: 'Fecha', en: 'Date' })), h('dd', {}, c.date)] : null,
                c.serial ? [h('dt', {}, t({ es: 'Nº verificación', en: 'Verification no.' })), h('dd', {}, c.serial)] : null,
                h('dt', {}, 'SHA-1'),
                h('dd', { class: 'muted' }, fp(c.id)),
              ),
            ),
          ),
        ),
      ),
    )
  },
}
