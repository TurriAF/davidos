// rubber-duck.exe: el Patito Debugger. Le cuentas tu bug y te responde (más o menos).
import { h, t, store, sleep, reducedMotion } from '../os/core.js'

const history = []
let sound = store.get('duck-sound', true)
let actx

function quack() {
  if (!sound) return
  try {
    actx ||= new (window.AudioContext || window.webkitAudioContext)()
    const now = actx.currentTime
    for (const [off, f] of [[0, 520], [0.16, 470]]) {
      const o = actx.createOscillator()
      const g = actx.createGain()
      const bp = actx.createBiquadFilter()
      o.type = 'sawtooth'
      o.frequency.setValueAtTime(f, now + off)
      o.frequency.exponentialRampToValueAtTime(f * 0.55, now + off + 0.13)
      bp.type = 'bandpass'
      bp.frequency.value = 1100
      bp.Q.value = 3
      g.gain.setValueAtTime(0.0001, now + off)
      g.gain.exponentialRampToValueAtTime(0.18, now + off + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, now + off + 0.14)
      o.connect(bp).connect(g).connect(actx.destination)
      o.start(now + off)
      o.stop(now + off + 0.16)
    }
  } catch {}
}

const RULES = [
  [/contrat|hire|trabajo|job|oferta|offer|entrevista|interview/, { es: 'Cuac. Excelente decisión. Te abro el pipeline de contacto 🚀', en: 'Quack. Excellent decision. Opening the contact pipeline 🚀' }, 'deploy'],
  [/hola|hello|hi\b|buenas|hey/, { es: 'Cuac cuac 👋 Cuéntame tu bug. Soy todo oídos (bueno, no tengo orejas).', en: "Quack quack 👋 Tell me your bug. I'm all ears (well, I have no ears)." }],
  [/css|center|centrar|div/, { es: 'Cuac. ¿Has probado display: grid; place-items: center? Si no funciona, otro div más. Siempre otro div.', en: 'Quack. Tried display: grid; place-items: center? If that fails, one more div. Always one more div.' }],
  [/java\b/, { es: 'Cuac. NullPointerException, ¿verdad? Mira quién es null. Spoiler: es el que no esperabas.', en: "Quack. NullPointerException, right? Check who's null. Spoiler: the one you didn't expect." }],
  [/php/, { es: 'Cuac. ¿Te falta un $ o un ; ? En PHP siempre es una de las dos.', en: "Quack. Missing a $ or a ; ? In PHP it's always one of those." }],
  [/sql|mysql|query|consulta/, { es: 'Cuac. ¿Te has dejado el WHERE en el DELETE? Respira. Hay backups. Hay backups… ¿verdad?', en: 'Quack. Forgot the WHERE in your DELETE? Breathe. There are backups. There are backups… right?' }],
  [/javascript|js\b|undefined|nan/, { es: 'Cuac. [] + {} da "[object Object]". No preguntes. Nadie sabe por qué.', en: 'Quack. [] + {} is "[object Object]". Don\'t ask. Nobody knows why.' }],
  [/git|merge|conflict/, { es: 'Cuac. git stash, git pull, git stash pop y rezar. En ese orden.', en: 'Quack. git stash, git pull, git stash pop and pray. In that order.' }],
  [/gracias|thanks|thank you/, { es: 'Cuac 💛 Para eso estoy. Literalmente. No sé hacer otra cosa.', en: "Quack 💛 That's what I'm here for. Literally. I can't do anything else." }],
  [/david/, { es: 'Cuac. David me escucha todos los días. Por eso sus bugs duran poco.', en: "Quack. David talks to me every day. That's why his bugs don't last long." }],
  [/funciona|works|arreglad|fixed|solucion/, { es: '¡CUAC! 🎉 ¿Ves? Solo tenías que explicármelo en voz alta.', en: 'QUACK! 🎉 See? You just had to explain it out loud.' }],
]

const RANDOM = [
  { es: 'Cuac. ¿Has probado a apagarlo y encenderlo?', en: 'Quack. Have you tried turning it off and on again?' },
  { es: 'Cuac… El fallo está entre la silla y el teclado. Con cariño.', en: 'Quack… The issue is between the chair and the keyboard. With love.' },
  { es: 'Cuac. Falta un punto y coma en la línea 42. Siempre es la 42.', en: "Quack. Missing semicolon on line 42. It's always line 42." },
  { es: 'Cuac. ¿Y si pones un console.log justo antes?', en: 'Quack. What if you add a console.log right before it?' },
  { es: 'Cuac. En mi máquina funciona. 🦆', en: 'Quack. Works on my machine. 🦆' },
  { es: 'Cuac. Léelo otra vez, despacio. Yo espero.', en: "Quack. Read it again, slowly. I'll wait." },
  { es: 'Cuac. Eso no es un bug, es una feature no documentada.', en: "Quack. That's not a bug, it's an undocumented feature." },
  { es: 'Cuac. Borra la caché. Luego borra node_modules. Luego borra tus dudas.', en: 'Quack. Clear the cache. Then delete node_modules. Then delete your doubts.' },
  { es: 'Cuac cuac. (Traducción: haz un descanso y tómate un café ☕)', en: 'Quack quack. (Translation: take a break and grab a coffee ☕)' },
]

function reply(text) {
  const q = text.toLowerCase()
  for (const [re, msg, app] of RULES) if (re.test(q)) return { msg, app }
  return { msg: RANDOM[Math.floor(Math.random() * RANDOM.length)] }
}

export default {
  id: 'duck',
  file: 'rubber-duck.exe',
  icon: 'duck',
  lane: 'fun',
  name: { es: 'Patito', en: 'Rubber duck' },
  keywords: ['pato', 'patito', 'duck', 'rubber', 'debug', 'cuac', 'quack'],
  w: 440,
  h: 540,
  dx: 180,
  dy: 0,
  noGutter: true,
  render(body, ctx) {
    const duck = h('div', {
      class: 'duck',
      title: 'cuac',
      onClick: () => (quack(), bob()),
      html: `<svg viewBox="0 0 120 100" aria-hidden="true"><ellipse cx="60" cy="92" rx="38" ry="5" fill="rgba(0,0,0,.25)"/><path d="M28 60c-8-2-14 2-14 12 0 13 18 18 44 18s42-7 42-22c0-10-7-15-17-16 4-5 6-10 6-16 0-14-11-24-25-24S39 22 39 36c0 8 3 14 8 18" fill="#ffd23f"/><path d="M47 54c-8-1-17 0-19 6" fill="none" stroke="#e8b400" stroke-width="3" stroke-linecap="round"/><path d="M78 36c6-2 14-2 20 1-5 4-12 6-19 5" fill="#ff8c1a"/><circle cx="66" cy="30" r="4.5" fill="#1d1d1d"/><circle cx="67.5" cy="28.5" r="1.4" fill="#fff"/><path d="M42 68c8 6 26 7 38 1" fill="none" stroke="#e8b400" stroke-width="3" stroke-linecap="round"/></svg>`,
    })
    const bubble = h('div', { class: 'duck-bubble', hidden: true }, 'CUAC!')
    const bob = () => {
      duck.classList.remove('bob')
      void duck.offsetWidth
      duck.classList.add('bob')
      bubble.hidden = false
      clearTimeout(bob.t)
      bob.t = setTimeout(() => (bubble.hidden = true), 900)
    }
    const log = h('div', { class: 'chat', 'aria-live': 'polite' })
    const paintLog = () => {
      log.replaceChildren(
        h('div', { class: 'msg duckmsg' }, t({ es: 'Cuac. Soy el patito de goma de David. Explícame tu bug línea a línea y lo resolveremos juntos.', en: "Quack. I'm David's rubber duck. Explain your bug line by line and we'll solve it together." })),
        ...history.map((m) => h('div', { class: `msg ${m.who}` }, m.who === 'me' ? m.text : t(m.text))),
      )
      log.scrollTop = log.scrollHeight
    }
    paintLog()
    const input = h('input', { class: 'chat-input', type: 'text', placeholder: t({ es: 'Mi código no funciona porque…', en: "My code doesn't work because…" }), 'aria-label': t({ es: 'Mensaje al pato', en: 'Message to the duck' }) })
    const form = h(
      'form',
      {
        class: 'chat-form',
        onSubmit: async (e) => {
          e.preventDefault()
          const text = input.value.trim()
          if (!text) return
          input.value = ''
          history.push({ who: 'me', text })
          paintLog()
          const typing = h('div', { class: 'msg duckmsg typing' }, '···')
          log.append(typing)
          log.scrollTop = log.scrollHeight
          if (!reducedMotion) await sleep(600 + Math.random() * 600)
          typing.remove()
          const r = reply(text)
          history.push({ who: 'duckmsg', text: r.msg })
          if (!body.isConnected) return
          paintLog()
          quack()
          bob()
          if (r.app) setTimeout(() => ctx.open(r.app), 900)
        },
      },
      input,
      h('button', { class: 'btn primary', type: 'submit' }, t({ es: 'Contar', en: 'Tell' })),
    )
    const sndBtn = h(
      'button',
      { class: 'btn small ghost', type: 'button', onClick: () => ((sound = !sound), store.put('duck-sound', sound), (sndBtn.textContent = sound ? '🔊' : '🔇')), 'aria-label': 'Sound' },
      sound ? '🔊' : '🔇',
    )
    body.append(h('div', { class: 'duckapp' }, h('div', { class: 'duck-stage' }, duck, bubble, sndBtn), log, form))
    setTimeout(() => input.focus(), 50)
  },
}
