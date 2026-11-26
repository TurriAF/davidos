// Selección múltiple tipo Windows: arrastrar con el clic izquierdo sobre el escritorio.
import { h, t } from './core.js'
import { open } from './windowManager.js'
import { toast } from './notify.js'

export function initSelection(desktop) {
  if (!matchMedia('(pointer: fine)').matches) return
  const rect = h('div', { class: 'select-rect', hidden: true })
  desktop.append(rect)
  let start = null
  let moved = false

  const icons = () => [...desktop.querySelectorAll('.dicon')]
  const selected = () => icons().filter((i) => i.classList.contains('selected'))
  const clear = () => icons().forEach((i) => i.classList.remove('selected'))

  desktop.addEventListener('pointerdown', (e) => {
    // Solo en el fondo: no sobre iconos, ventanas, bugs, etc.
    if (e.button !== 0) return
    if (e.target !== desktop && !e.target.classList.contains('icons')) return
    e.preventDefault()
    document.activeElement?.blur?.()
    const r = desktop.getBoundingClientRect()
    start = { x: e.clientX - r.left, y: e.clientY - r.top, r }
    moved = false
    if (!e.ctrlKey && !e.shiftKey) clear()
    desktop.setPointerCapture(e.pointerId)
  })

  desktop.addEventListener('pointermove', (e) => {
    if (!start) return
    const x = e.clientX - start.r.left
    const y = e.clientY - start.r.top
    const L = Math.min(x, start.x)
    const T = Math.min(y, start.y)
    const W = Math.abs(x - start.x)
    const H = Math.abs(y - start.y)
    if (!moved && W + H < 4) return
    moved = true
    rect.hidden = false
    Object.assign(rect.style, { left: L + 'px', top: T + 'px', width: W + 'px', height: H + 'px' })
    // Iconos que toca el rectángulo
    const sel = { l: L + start.r.left, t: T + start.r.top, r: L + W + start.r.left, b: T + H + start.r.top }
    for (const ic of icons()) {
      const b = ic.getBoundingClientRect()
      const hit = b.left < sel.r && b.right > sel.l && b.top < sel.b && b.bottom > sel.t
      if (hit) ic.classList.add('selected')
      else if (!e.ctrlKey && !e.shiftKey) ic.classList.remove('selected')
    }
  })

  const end = () => {
    if (!start) return
    start = null
    rect.hidden = true
    const n = selected().length
    if (moved && n > 1) selected()[0].focus({ preventScroll: true })
  }
  desktop.addEventListener('pointerup', end)
  desktop.addEventListener('pointercancel', end)

  addEventListener('keydown', (e) => {
    const typing = e.target.closest?.('input, textarea, select, [contenteditable]') || e.target.closest?.('.win')
    if (typing || !document.querySelector('.desktop-ready')) return
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
      e.preventDefault()
      icons().forEach((i) => i.classList.add('selected'))
      return
    }
    const sel = selected()
    if (!sel.length) return
    if (e.key === 'Enter') {
      e.preventDefault()
      sel.forEach((i, k) => setTimeout(() => open(i.dataset.app), k * 90))
      clear()
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      toast(sel.length > 1 ? { es: `No puedes borrar ${sel.length} partes de mi experiencia 😄`, en: `You can't delete ${sel.length} pieces of my experience 😄` } : { es: 'No puedes borrar mi experiencia 😄', en: "You can't delete my experience 😄" }, { icon: '🗑' })
    } else if (e.key === 'Escape') clear()
  })

  // Un clic normal sobre un icono lo abre (como siempre) y limpia la selección
  desktop.addEventListener('click', (e) => {
    if (e.target.closest('.dicon') && !e.ctrlKey && !e.shiftKey) clear()
  })
}
