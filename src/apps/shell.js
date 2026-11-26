// daf-sh: la shell de DavidOS.
import { h, t, state, set } from '../os/core.js'
import { getApps } from '../os/windowManager.js'
import { person, skills } from '../data/cv.js'
import { getProjects } from '../os/projects.js'
import { downloadCV } from '../os/cvdoc.js'
import { brew } from '../os/caffeine.js'

const lines = []
const hist = []

export default {
  id: 'shell',
  file: 'daf-sh',
  icon: 'shell',
  lane: 'sys',
  name: { es: 'Terminal', en: 'Terminal' },
  keywords: ['shell', 'terminal', 'consola', 'console', 'bash', 'cli'],
  w: 640,
  h: 420,
  dx: -40,
  dy: 60,
  noGutter: true,
  render(body, ctx) {
    let hi = hist.length
    const out = h('div', { class: 'sh-out', 'aria-live': 'polite' })
    const input = h('input', { class: 'sh-in', type: 'text', spellcheck: 'false', autocomplete: 'off', 'aria-label': 'daf-sh' })
    const print = (text, cls = '') => {
      lines.push({ text, cls })
      out.append(h('div', { class: 'sh-l ' + cls }, text))
      out.scrollTop = out.scrollHeight
    }
    if (!lines.length) {
      print(`daf-sh 1.0 · DavidOS v1.0 "Almería"`, 'dim')
      print(t({ es: 'Escribe "help" para ver los comandos.', en: 'Type "help" to see the commands.' }), 'dim')
    } else lines.forEach((l) => out.append(h('div', { class: 'sh-l ' + l.cls }, l.text)))

    const appIds = () => getApps().map((a) => a.id)
    const CMDS = {
      help: () =>
        print(
          [
            'help                 ' + t({ es: 'esta ayuda', en: 'this help' }),
            'whoami               ' + t({ es: 'quién soy', en: 'who am I' }),
            'ls                   ' + t({ es: 'lista las apps', en: 'list apps' }),
            'open <app>           ' + t({ es: 'abre una app (p. ej. open repos)', en: 'open an app (e.g. open repos)' }),
            'skills               ' + t({ es: 'mis tecnologías', en: 'my tech stack' }),
            'projects             ' + t({ es: 'mis proyectos', en: 'my projects' }),
            'contact              ' + t({ es: 'cómo contactarme', en: 'how to reach me' }),
            'cv                   ' + t({ es: 'descarga mi CV', en: 'download my CV' }),
            'git blame            ' + t({ es: '¿quién ha hecho esto?', en: 'who made this?' }),
            'checkout <main|ops>  ' + t({ es: 'cambia de rama', en: 'switch branch' }),
            'lang <es|en>         ' + t({ es: 'cambia el idioma', en: 'change language' }),
            'coffee               ' + t({ es: 'recarga cafeína', en: 'refill caffeine' }),
            'clear                ' + t({ es: 'limpia la pantalla', en: 'clear the screen' }),
          ].join('\n'),
        ),
      whoami: () => print(`${person.name}\n${t(person.role)} · ${t(person.location)}`),
      ls: () => print(getApps().map((a) => a.id.padEnd(12) + a.file).join('\n')),
      open: (arg) => (appIds().includes(arg) ? (ctx.open(arg), print('→ ' + arg, 'ok')) : print(t({ es: `open: no existe "${arg || ''}". Prueba "ls".`, en: `open: "${arg || ''}" not found. Try "ls".` }), 'err')),
      skills: () => print('dev: ' + skills.dev.map((s) => s.label).join(', ') + '\nops: ' + skills.ops.map((s) => t(s.label)).join(', ')),
      projects: () => print(getProjects().map((p) => `${p.name.padEnd(14)} ${t(p.desc)}`).join('\n')),
      contact: () => print(`email:    ${person.email}\nlinkedin: ${person.linkedin}\ngithub:   ${person.github}`),
      cv: () => (downloadCV(), print('⬇ David_Aguilar_CV.pdf', 'ok')),
      git: (arg) =>
        arg === 'blame'
          ? print(t({ es: '^a1b2c3d (David Aguilar 2026) Todo. Absolutamente todo. Hasta el pato.', en: '^a1b2c3d (David Aguilar 2026) Everything. Absolutely everything. Even the duck.' }))
          : arg === 'status'
            ? print(t({ es: 'En la rama ' + state.branch + '\nTu rama está al día con "origin/busco-trabajo".\nnada que commitear, el árbol está limpio', en: 'On branch ' + state.branch + '\nYour branch is up to date with "origin/open-to-work".\nnothing to commit, working tree clean' }))
            : arg === 'log'
              ? (ctx.open('gitlog'), print('→ experience.log', 'ok'))
              : print('git: blame | status | log'),
      checkout: (arg) => (arg === 'main' || arg === 'ops' ? (set('branch', arg), print(`Switched to branch '${arg}'`, 'ok')) : print('checkout: main | ops', 'err')),
      lang: (arg) => (arg === 'es' || arg === 'en' ? set('lang', arg) : print('lang: es | en', 'err')),
      coffee: () => (brew(), print('☕ caffeine = 100%', 'ok')),
      sudo: (arg, rest) =>
        /hire|contratar/.test(rest)
          ? (print(t({ es: '[sudo] contraseña para reclutador: ******\n✓ Permiso concedido. Abriendo contacto…', en: '[sudo] password for recruiter: ******\n✓ Permission granted. Opening contact…' }), 'ok'), setTimeout(() => ctx.open('deploy'), 700))
          : print(t({ es: 'Este incidente será reportado. (Es broma. Prueba "sudo hire david")', en: 'This incident will be reported. (Just kidding. Try "sudo hire david")' }), 'err'),
      rm: (arg, rest) => (/-rf/.test(rest) ? print(t({ es: 'Buen intento 😏  El sistema está protegido por un pato.', en: 'Nice try 😏  This system is protected by a duck.' }), 'err') : print('rm: ' + t({ es: 'operación no permitida', en: 'operation not permitted' }), 'err')),
      exit: () => ctx.close(),
      clear: () => {
        lines.length = 0
        out.replaceChildren()
      },
      echo: (arg, rest) => print(rest),
      date: () => print(new Date().toString()),
      neofetch: () =>
        print(
          [
            '   ██████     david@davidos',
            '   ██   ██    ------------',
            '   ██   ██    OS: DavidOS v1.0 "Almería"',
            '   ██   ██    Kernel: vanilla-js',
            '   ██████     Shell: daf-sh 1.0',
            '              Branch: ' + state.branch,
            '              Caffeine: ' + state.caffeine + '%',
          ].join('\n'),
          'accent',
        ),
    }

    function run(raw) {
      const cmd = raw.trim()
      print(`david@davidos:~$ ${cmd}`, 'cmd')
      if (!cmd) return
      hist.push(cmd)
      hi = hist.length
      const [name, arg] = cmd.split(/\s+/)
      const rest = cmd.slice(name.length).trim()
      const fn = CMDS[name.toLowerCase()]
      if (fn) fn(arg?.toLowerCase(), rest.toLowerCase())
      else print(`daf-sh: command not found: ${name}`, 'err')
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        run(input.value)
        input.value = ''
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (hi > 0) input.value = hist[--hi]
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        hi = Math.min(hist.length, hi + 1)
        input.value = hist[hi] || ''
      } else if (e.key === 'Tab') {
        e.preventDefault()
        const all = [...Object.keys(CMDS), ...appIds().map((a) => 'open ' + a)]
        const m = all.find((c) => c.startsWith(input.value) && input.value)
        if (m) input.value = m
      }
    })
    const wrap = h('div', { class: 'shell', onClick: () => input.focus() }, out, h('label', { class: 'sh-row' }, h('span', { class: 'sh-ps' }, 'david@davidos:~$'), input))
    body.append(wrap)
    setTimeout(() => input.focus(), 50)
  },
}
