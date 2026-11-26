import '@fontsource-variable/bricolage-grotesque/opsz.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-500.css'
import '@fontsource/ibm-plex-mono/latin-600.css'
import './styles/tokens.css'
import './styles/os.css'
import './styles/windows.css'
import './styles/apps.css'
import './styles/doc.css'
import './styles/v2.css'
import './styles/v3.css'

import { h, t, state, set, on, store, isMobile } from './os/core.js'
import apps from './apps/index.js'
import { registerApps, initWindows, open, closeAll, openIds } from './os/windowManager.js'
import { boot } from './os/boot.js'
import { login } from './os/login.js'
import { initWallpaper } from './os/wallpaper.js'
import { initDesktopIcons } from './os/desktop.js'
import { initTaskbar } from './os/taskbar.js'
import { initPalette } from './os/palette.js'
import { initCaffeine, brew } from './os/caffeine.js'
import { initSimple, openSimple } from './os/simple.js'
import { downloadCV } from './os/cvdoc.js'
import { initAnalytics } from './os/analytics.js'
import { toast } from './os/notify.js'
import { startIncident } from './apps/bugsquash.js'
import { shouldWelcome } from './apps/welcome.js'

// ---------- Idioma y rama ----------
const root = document.documentElement
const savedLang = store.get('lang', null)
set('lang', savedLang || (/^en/i.test(navigator.language) ? 'en' : 'es'))
root.lang = state.lang
root.dataset.branch = state.branch
on('lang', (v) => {
  root.lang = v
  store.put('lang', v)
  document.title = v === 'es' ? 'DavidOS · David Aguilar Fernández' : 'DavidOS · David Aguilar Fernández'
})
on('branch', (v) => {
  root.dataset.branch = v
  if (document.querySelector('.desktop-ready')) toast(v === 'main' ? { es: 'Perfil: desarrollo web', en: 'Profile: web development' } : { es: 'Perfil: sistemas y redes', en: 'Profile: systems & networks' }, { icon: '⑂' })
})

// ---------- Estructura ----------
const app = document.getElementById('app')
const desktop = h('div', { class: 'desktop', id: 'desktop' })
const os = h('div', { class: 'os', id: 'os' }, h('canvas', { class: 'wallpaper', 'aria-hidden': 'true' }), desktop)
app.append(os)

registerApps(apps)
initAnalytics()
initWindows(desktop)
initSimple()
initCaffeine()

document.getElementById('skip').addEventListener('click', (e) => {
  e.preventDefault()
  openSimple()
})

initPalette([
  { id: 'cv', icon: 'download', label: { es: 'Descargar CV', en: 'Download CV' }, hint: 'PDF', keywords: 'cv curriculum resume pdf download descargar', run: downloadCV },
  { id: 'branch', icon: 'branch', label: { es: 'Cambiar de perfil (desarrollo ⇄ sistemas)', en: 'Switch profile (development ⇄ systems)' }, hint: 'git checkout', keywords: 'branch rama checkout main ops dev sys', run: () => set('branch', state.branch === 'main' ? 'ops' : 'main') },
  { id: 'lang', icon: 'globe', label: { es: 'Switch to English', en: 'Cambiar a español' }, hint: 'ES / EN', keywords: 'idioma language english español ingles', run: () => set('lang', state.lang === 'es' ? 'en' : 'es') },
  { id: 'simple', icon: 'eye', label: { es: 'Vista simple (CV en una página)', en: 'Simple view (one-page CV)' }, hint: '', keywords: 'simple accesible accessible cv', run: openSimple },
  { id: 'coffee', icon: 'coffee', label: { es: 'Recargar cafeína', en: 'Refill caffeine' }, hint: 'coffee.sys', keywords: 'cafe coffee', run: () => (brew(), toast({ es: 'Cafeína al 100% ☕', en: 'Caffeine at 100% ☕' }, { icon: '☕', tone: 'ok' })) },
  { id: 'closeall', icon: 'power', label: { es: 'Cerrar todas las ventanas', en: 'Close all windows' }, hint: '', keywords: 'close cerrar todo all', run: closeAll },
  {
    id: 'reboot', icon: 'power', label: { es: 'Reiniciar DavidOS', en: 'Reboot DavidOS' }, hint: '', keywords: 'reboot reiniciar restart',
    run: () => {
      try { sessionStorage.removeItem('davidos:booted') } catch {}
      location.reload()
    },
  },
])

// ---------- Arranque ----------
async function start() {
  // Segunda visita en la misma sesión: directo al escritorio (los reclutadores no repiten el arranque)
  let again = null
  try {
    again = sessionStorage.getItem('davidos:booted')
  } catch {}
  if (again === 'main' || again === 'ops') set('branch', again)
  else {
    await boot(document.body, { onSimple: openSimple })
    await login(document.body, { onSimple: openSimple, onDownload: downloadCV })
  }
  try {
    sessionStorage.setItem('davidos:booted', state.branch)
  } catch {}
  on('branch', (b) => {
    try {
      sessionStorage.setItem('davidos:booted', b)
    } catch {}
  })

  os.classList.add('desktop-ready')
  initWallpaper(os.querySelector('.wallpaper'))
  initDesktopIcons(desktop)
  initTaskbar(os)

  setTimeout(() => {
    open(shouldWelcome() ? 'welcome' : state.branch === 'ops' ? 'sysmon' : 'readme')
    toast({ es: 'Bienvenido a DavidOS', en: 'Welcome to DavidOS' }, { icon: '👋' })
  }, 350)
  setTimeout(() => {
    if (!isMobile()) toast({ es: 'Truco: Ctrl+K abre cualquier cosa', en: 'Tip: Ctrl+K opens anything' }, { icon: '⌘', ms: 5000 })
  }, 4200)

  // Incidente si el escritorio se queda quieto un rato
  let idle
  const resetIdle = () => {
    clearTimeout(idle)
    idle = setTimeout(() => !openIds().includes('bugsquash') && startIncident(desktop), 75000)
  }
  ;['pointermove', 'keydown', 'pointerdown'].forEach((ev) => addEventListener(ev, resetIdle, { passive: true }))
  resetIdle()
}

start()
