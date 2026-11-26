import { h, t, sleep, copyText, reducedMotion } from '../os/core.js'
import { track } from '../os/analytics.js'
import { person } from '../data/cv.js'
import { icons } from '../os/icons.js'
import { toast } from '../os/notify.js'

let deployed = false
const draft = { name: '', email: '', company: '', message: '' }

// Envío con Netlify Forms (el formulario "contact" está declarado también en index.html)
async function sendForm(data) {
  const body = new URLSearchParams({ 'form-name': 'contact', 'bot-field': '', ...data }).toString()
  const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
  if (!r.ok) throw new Error(String(r.status))
  track('contacto-enviado', 'Mensaje de contacto enviado')
}

export default {
  id: 'deploy',
  file: 'deploy.yml',
  icon: 'deploy',
  lane: 'dev',
  name: { es: 'Contacto', en: 'Contact' },
  keywords: ['contacto', 'contact', 'email', 'correo', 'linkedin', 'github', 'hire', 'contratar', 'mensaje', 'message'],
  w: 620,
  h: 600,
  dx: 80,
  dy: 20,
  render(body) {
    // ---- Formulario ----
    const field = (name, label, el) => h('label', { class: 'up-field' }, h('span', { class: 'up-label' }, label), el)
    const input = (name, attrs) => {
      const el = h('input', { class: 'up-input', name, ...attrs })
      el.value = draft[name]
      el.addEventListener('input', () => (draft[name] = el.value))
      return el
    }
    const msg = h('textarea', { class: 'up-input', name: 'message', rows: 4, required: true, maxlength: 2000, placeholder: t({ es: 'Hola David, te escribo por…', en: 'Hi David, I am reaching out about…' }) })
    msg.value = draft.message
    msg.addEventListener('input', () => (draft.message = msg.value))
    const send = h('button', { class: 'btn primary', type: 'submit' }, h('span', { html: icons.deploy }), t({ es: 'Enviar mensaje', en: 'Send message' }))
    const form = h(
      'form',
      {
        class: 'contact-form',
        name: 'contact',
        onSubmit: async (e) => {
          e.preventDefault()
          if (!form.reportValidity()) return
          send.disabled = true
          try {
            await sendForm({ name: draft.name, email: draft.email, company: draft.company, message: draft.message })
            Object.keys(draft).forEach((k) => (draft[k] = ''))
            form.reset()
            toast({ es: '¡Mensaje enviado! Te responderé lo antes posible.', en: 'Message sent! I’ll get back to you as soon as possible.' }, { icon: '✓', tone: 'ok', ms: 5000 })
          } catch {
            toast({ es: `No se pudo enviar. Escríbeme a ${person.email}`, en: `Could not send. Email me at ${person.email}` }, { icon: '!', tone: 'warn', ms: 7000 })
          } finally {
            send.disabled = false
          }
        },
      },
      h('div', { class: 'up-row' }, field('name', t({ es: 'Nombre *', en: 'Name *' }), input('name', { required: true, maxlength: 80, autocomplete: 'name' })), field('company', t({ es: 'Empresa', en: 'Company' }), input('company', { maxlength: 80, autocomplete: 'organization' }))),
      field('email', t({ es: 'Email *', en: 'Email *' }), input('email', { type: 'email', required: true, maxlength: 120, autocomplete: 'email' })),
      field('message', t({ es: 'Mensaje *', en: 'Message *' }), msg),
      h('p', { class: 'hp', 'aria-hidden': 'true' }, h('input', { name: 'bot-field', tabindex: '-1', autocomplete: 'off' })),
      h('div', { class: 'actions' }, send),
    )

    // ---- Canales directos ----
    const channel = (ico, label, value, href, extra) =>
      h(
        'div',
        { class: 'channel' },
        h('span', { class: 'channel-ico', html: ico }),
        h('div', { class: 'channel-txt' }, h('span', { class: 'muted small' }, label), h('a', { href, target: href.startsWith('http') ? '_blank' : null, rel: 'noopener' }, value)),
        extra,
      )
    const channels = h(
      'div',
      { class: 'channels' },
      channel(
        icons.mail,
        'Email',
        person.email,
        'mailto:' + person.email,
        h(
          'button',
          {
            class: 'btn small',
            type: 'button',
            onClick: async () => {
              const ok = await copyText(person.email)
              toast(ok ? { es: 'Email copiado al portapapeles', en: 'Email copied to clipboard' } : person.email, { icon: '⧉', tone: ok ? 'ok' : 'info' })
            },
          },
          h('span', { html: icons.copy }),
          t({ es: 'Copiar', en: 'Copy' }),
        ),
      ),
      channel(icons.linkedin, 'LinkedIn', 'David Aguilar Fernández', person.linkedin),
      channel(icons.github, 'GitHub', '@' + person.githubUser, person.github),
    )

    // ---- Guiño friki: pipeline ----
    const stages = [
      ['build', t({ es: 'compilar', en: 'build' })],
      ['test', t({ es: 'tests', en: 'test' })],
      ['review', t({ es: 'revisión', en: 'review' })],
      ['hire', t({ es: 'contratar', en: 'hire' })],
    ]
    const pipe = h(
      'div',
      { class: 'pipe' },
      stages.map(([k, label], i) => [i ? h('span', { class: 'pipe-link' }) : null, h('div', { class: `pipe-st${deployed ? ' done' : ''}`, 'data-k': k }, h('span', { class: 'pipe-dot' }), h('span', {}, label))]),
    )
    const log = h('pre', { class: 'term small', 'aria-live': 'polite', hidden: !deployed }, deployed ? '✓ Ready to hire · David\n' : '')
    const btn = h('button', { class: 'btn small', type: 'button', onClick: run }, '🚀 Deploy')
    async function run() {
      btn.disabled = true
      log.hidden = false
      const sts = [...pipe.querySelectorAll('.pipe-st')]
      sts.forEach((s) => s.classList.remove('done', 'run'))
      const steps = [
        t({ es: 'compilando ganas de aprender… ok', en: 'compiling eagerness to learn… ok' }),
        t({ es: 'ejecutando tests: java, php, js, sql… 4/4 passed', en: 'running tests: java, php, js, sql… 4/4 passed' }),
        t({ es: 'code review: aprobado por el patito 🦆', en: 'code review: approved by the duck 🦆' }),
        t({ es: 'esperando tu mensaje…', en: 'waiting for your message…' }),
      ]
      log.textContent = '$ davidos deploy --env=tu-empresa\n'
      for (let i = 0; i < sts.length; i++) {
        sts[i].classList.add('run')
        log.textContent += `▸ ${steps[i]}\n`
        if (!reducedMotion) await sleep(600)
        sts[i].classList.remove('run')
        sts[i].classList.add('done')
      }
      log.textContent += '\n✓ Ready to hire\n'
      deployed = true
      btn.disabled = false
    }

    body.append(
      h(
        'div',
        { class: 'pad' },
        h('h2', { class: 'section-title' }, t({ es: 'Hablemos.', en: "Let's talk." })),
        h('p', { class: 'lead' }, t({ es: '¿Tienes una oferta o un proyecto? Escríbeme por aquí o por el canal que prefieras. Respondo rápido.', en: 'Got a role or a project? Write here or through any channel you prefer. I reply quickly.' })),
        form,
        h('h3', { class: 'sub' }, t({ es: 'O directamente', en: 'Or directly' })),
        channels,
        h('div', { class: 'fun-box' }, h('div', { class: 'toolbar' }, h('span', { class: 'muted small' }, t({ es: 'Para developers: despliega mi contratación 😄', en: 'For developers: deploy my hiring 😄' })), btn), pipe, log),
      ),
    )
  },
}
