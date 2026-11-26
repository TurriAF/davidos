// coffee.sys: la cafetera del sistema.
import { h, t, state, on, reducedMotion } from '../os/core.js'
import { brew, cups } from '../os/caffeine.js'
import { toast } from '../os/notify.js'

let meterRef = null
let brewing = false
on('caffeine', (v) => {
  if (meterRef?.isConnected) {
    meterRef.querySelector('i').style.width = v + '%'
    meterRef.querySelector('b').textContent = v + '%'
  }
})

export default {
  id: 'coffee',
  file: 'coffee.sys',
  icon: 'coffee',
  lane: 'fun',
  name: { es: 'Café', en: 'Coffee' },
  keywords: ['cafe', 'coffee', 'cafeina', 'caffeine', 'cafetera'],
  w: 400,
  h: 500,
  dx: 220,
  dy: 40,
  noGutter: true,
  render(body) {
    const machine = h('div', {
      class: 'coffee-machine',
      html: `<svg viewBox="0 0 160 170" aria-hidden="true">
        <rect x="22" y="8" width="116" height="34" rx="8" fill="var(--panel2)" stroke="var(--line)" stroke-width="2"/>
        <circle cx="44" cy="25" r="6" class="cm-led"/>
        <rect x="62" y="20" width="58" height="10" rx="5" fill="var(--bg)"/>
        <rect x="30" y="42" width="100" height="78" rx="6" fill="var(--panel)" stroke="var(--line)" stroke-width="2"/>
        <rect x="70" y="42" width="20" height="14" fill="var(--panel2)"/>
        <path class="cm-drip" d="M80 56v34" stroke="#6f4a2f" stroke-width="4" stroke-linecap="round"/>
        <g class="cm-cup">
          <path d="M56 92h48l-5 40a6 6 0 0 1-6 5H67a6 6 0 0 1-6-5z" fill="#f2efe9" stroke="var(--line)" stroke-width="2"/>
          <path d="M104 100h6a9 9 0 0 1 0 18h-8" fill="none" stroke="#f2efe9" stroke-width="5"/>
          <clipPath id="cupclip"><path d="M58 94h44l-5 38a5 5 0 0 1-5 4H68a5 5 0 0 1-5-4z"/></clipPath>
          <rect class="cm-fill" x="50" y="136" width="60" height="44" fill="#6f4a2f" clip-path="url(#cupclip)"/>
        </g>
        <g class="cm-steam" stroke="var(--muted)" stroke-width="2.5" fill="none" stroke-linecap="round">
          <path d="M70 86c-4-5 4-8 0-13"/><path d="M82 84c-4-5 4-8 0-13"/><path d="M94 86c-4-5 4-8 0-13"/>
        </g>
        <rect x="20" y="140" width="120" height="14" rx="5" fill="var(--panel2)" stroke="var(--line)" stroke-width="2"/>
      </svg>`,
    })
    const meter = h('div', { class: 'cmeter' }, h('span', { class: 'muted small' }, t({ es: 'Cafeína del sistema', en: 'System caffeine' })), h('div', { class: 'cmeter-bar' }, h('i', { style: { width: state.caffeine + '%' } })), h('b', {}, state.caffeine + '%'))
    meterRef = meter
    const count = h('p', { class: 'muted small center' }, t({ es: 'Cafés preparados en este navegador', en: 'Coffees brewed in this browser' }) + ': ', h('b', {}, String(cups())))
    const btn = h(
      'button',
      {
        class: 'btn primary big',
        type: 'button',
        onClick: () => {
          if (brewing) return
          brewing = true
          btn.disabled = true
          machine.classList.remove('done')
          machine.classList.add('brewing')
          setTimeout(
            () => {
              machine.classList.remove('brewing')
              machine.classList.add('done')
              const n = brew()
              count.querySelector('b').textContent = String(n)
              brewing = false
              btn.disabled = false
              toast({ es: `Café #${n} listo. Productividad restaurada al 100% ☕`, en: `Coffee #${n} ready. Productivity restored to 100% ☕` }, { icon: '☕', tone: 'ok' })
            },
            reducedMotion ? 200 : 2600,
          )
        },
      },
      '☕ ' + t({ es: 'Preparar café', en: 'Brew coffee' }),
    )
    body.append(
      h(
        'div',
        { class: 'pad coffeeapp' },
        machine,
        meter,
        h('div', { class: 'center' }, btn),
        count,
        h('p', { class: 'muted small center' }, t({ es: 'Aviso: si la cafeína llega a 0%, DavidOS se queda medio dormido. Igual que su creador.', en: 'Warning: at 0% caffeine DavidOS gets sleepy. Just like its creator.' })),
      ),
    )
  },
}
