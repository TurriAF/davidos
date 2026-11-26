// Interruptor "Ver como developer": vista sencilla por defecto (RR. HH.), técnica opcional.
import { h, t, store } from './core.js'

export const isDevView = (id) => store.get('devview:' + id, false)

export function devToggle(id, ctx) {
  const on = isDevView(id)
  return h(
    'button',
    {
      class: `devtgl${on ? ' on' : ''}`,
      type: 'button',
      role: 'switch',
      'aria-checked': String(on),
      title: on ? t({ es: 'Volver a la vista sencilla', en: 'Back to simple view' }) : t({ es: 'La misma información, en versión friki', en: 'Same info, geek version' }),
      onClick: () => {
        store.put('devview:' + id, !on)
        ctx.rerender()
      },
    },
    h('span', { class: 'devtgl-track' }, h('span', { class: 'devtgl-knob' })),
    h('span', {}, '</> ', t({ es: 'Ver como developer', en: 'View as developer' })),
  )
}
