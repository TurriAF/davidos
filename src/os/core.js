// Estado global, eventos, i18n y utilidades DOM de DavidOS.

const listeners = {}

export const state = {
  lang: 'es',
  branch: 'main',
  caffeine: 100,
}

export function set(key, value) {
  if (state[key] === value) return
  state[key] = value
  ;(listeners[key] || []).forEach((fn) => fn(value))
}

export function on(key, fn) {
  ;(listeners[key] ||= []).push(fn)
}

export function emit(key, value) {
  ;(listeners[key] || []).forEach((fn) => fn(value))
}

// Persistencia por visitante (todo envuelto: puede fallar en modo privado).
export const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem('davidos:' + key)
      return v == null ? fallback : JSON.parse(v)
    } catch {
      return fallback
    }
  },
  put(key, value) {
    try {
      localStorage.setItem('davidos:' + key, JSON.stringify(value))
    } catch {}
  },
}

// t({es, en}) -> texto en el idioma actual. Si no es objeto bilingüe, lo devuelve tal cual.
export function t(v) {
  if (v && typeof v === 'object' && !Array.isArray(v) && ('es' in v || 'en' in v)) return v[state.lang] ?? v.es
  return v
}

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
export const isMobile = () => matchMedia('(max-width: 768px)').matches

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// h('div', {class:'x', onClick: fn}, 'texto', otroNodo)
export function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue
    if (k === 'class') el.className = v
    else if (k === 'html') el.innerHTML = v
    else if (k === 'text') el.textContent = v
    else if (k === 'style' && typeof v === 'object') for (const [sk, sv] of Object.entries(v)) sk.startsWith('--') ? el.style.setProperty(sk, sv) : (el.style[sk] = sv)
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v)
    else el.setAttribute(k, v === true ? '' : v)
  }
  for (const c of kids.flat(Infinity)) {
    if (c == null || c === false) continue
    el.append(c instanceof Node ? c : document.createTextNode(String(c)))
  }
  return el
}

// Hash corto determinista, para que cada "commit" tenga siempre el mismo id.
export function hash(str) {
  let a = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    a ^= str.charCodeAt(i)
    a = Math.imul(a, 0x01000193)
  }
  return (a >>> 0).toString(16).padStart(8, '0').slice(0, 7)
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = h('textarea', { style: { position: 'fixed', opacity: '0' } })
    ta.value = text
    document.body.append(ta)
    ta.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {}
    ta.remove()
    return ok
  }
}
