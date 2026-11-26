// Analítica sin cookies con GoatCounter (gratis). Solo se activa si existe la variable
// VITE_GOATCOUNTER (p. ej. "davidaguilar") en Netlify → Environment variables.
const code = import.meta.env.VITE_GOATCOUNTER

export function initAnalytics() {
  if (!code || import.meta.env.DEV) return
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://gc.zgo.at/count.js'
  s.dataset.goatcounter = `https://${code}.goatcounter.com/count`
  document.head.append(s)
}

// Eventos: descarga del CV, mensaje enviado, app abierta…
export function track(name, title = name) {
  try {
    window.goatcounter?.count?.({ path: name, title, event: true })
  } catch {}
}
