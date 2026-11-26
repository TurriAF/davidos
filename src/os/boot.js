// Arranque = compilación. DavidOS se "construye" a sí mismo antes de iniciar.
import { h, t, sleep, reducedMotion } from './core.js'
import { icons } from './icons.js'

const LINES = [
  ['dim', 'DavidOS bootloader · v1.0 "Almería"'],
  ['cmd', '$ vite build --mode portfolio --author "David Aguilar"'],
  ['dim', 'vite v8 building for production...'],
  ['ok', 'resolving @david/core'],
  ['ok', 'transforming java · php · javascript · sql'],
  ['ok', 'linking react · git · gitlab'],
  ['ok', 'mounting ~/repos (4 repos)'],
  ['ok', 'loading optionalDependencies: active-directory, networking, aws'],
  ['ok', 'brewing coffee.sys'],
  ['warn', 'rubber-duck.exe is listening'],
  ['ok', '128 modules transformed.'],
  ['dim', 'dist/davidos.js      42.00 kB │ gzip: 13.37 kB'],
]

export function boot(root, { fast = false, onSimple } = {}) {
  return new Promise(async (resolve) => {
    let skip = reducedMotion
    const log = h('div', { class: 'boot-log', 'aria-live': 'polite' })
    const fill = h('div', { class: 'boot-fill' })
    const hint = h(
      'div',
      { class: 'boot-hint' },
      h('span', {}, t({ es: 'Pulsa cualquier tecla para saltar', en: 'Press any key to skip' })),
      onSimple ? h('button', { class: 'boot-cv', type: 'button', onPointerdown: (e) => e.stopPropagation(), onClick: () => ((skip = true), onSimple()) }, t({ es: '¿Prisa? Ver CV directamente →', en: 'In a hurry? View CV now →' })) : null,
    )
    const screen = h(
      'div',
      { class: 'boot' },
      h('div', { class: 'boot-inner' }, log, h('div', { class: 'boot-bar' }, fill), hint),
    )
    root.append(screen)

    const doSkip = () => (skip = true)
    addEventListener('keydown', doSkip, { once: true })
    screen.addEventListener('pointerdown', doSkip, { once: true })

    const start = performance.now()
    const unit = fast ? 25 : 70
    for (let i = 0; i < LINES.length; i++) {
      const [kind, text] = LINES[i]
      const prefix = kind === 'ok' ? '✓ ' : kind === 'warn' ? '! ' : ''
      log.append(h('div', { class: `boot-line ${kind}` }, prefix + text))
      fill.style.width = ((i + 1) / LINES.length) * 100 + '%'
      if (!skip) await sleep(unit * (0.5 + Math.random()))
    }
    const secs = ((performance.now() - start) / 1000).toFixed(2)
    log.append(h('div', { class: 'boot-line ok big' }, `✓ built in ${secs}s`))

    // Logo final
    if (!skip) await sleep(fast ? 80 : 180)
    screen.classList.add('logo')
    screen.append(
      h(
        'div',
        { class: 'boot-logo' },
        h('span', { class: 'boot-mark', html: icons.logo }),
        h('span', { class: 'boot-name' }, 'David', h('b', {}, 'OS')),
      ),
    )
    if (!skip) await sleep(fast ? 300 : 650)
    removeEventListener('keydown', doSkip)
    screen.classList.add('out')
    setTimeout(() => screen.remove(), 400)
    resolve()
  })
}
