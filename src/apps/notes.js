import { h, t, store } from '../os/core.js'

const DEFAULT = {
  es: `TODO.txt
========
[x] Terminar el ciclo de DAW
[x] Prácticas en Michelin (GitLab ✓)
[x] Erasmus en Génova 🇮🇹
[x] Construir mi propio sistema operativo (este)
[ ] Encontrar un equipo de desarrollo genial
[ ] Que tú me contrates  ← estás aquí

notas:
- comprar más café
- no hacer deploy los viernes
- darle las gracias al pato

(Puedes escribir aquí. Se guarda en tu navegador.)`,
  en: `TODO.txt
========
[x] Finish the Web Development degree
[x] Internship at Michelin (GitLab ✓)
[x] Erasmus in Genoa 🇮🇹
[x] Build my own operating system (this one)
[ ] Find an awesome dev team
[ ] Get hired by you  ← you are here

notes:
- buy more coffee
- never deploy on Fridays
- thank the duck

(You can type here. It's saved in your browser.)`,
}

export default {
  id: 'notes',
  pinned: false,
  file: 'todo.txt',
  icon: 'notes',
  lane: 'sys',
  name: { es: 'Notas', en: 'Notes' },
  keywords: ['notas', 'notes', 'todo', 'bloc'],
  w: 440,
  h: 440,
  dx: 200,
  dy: -60,
  render(body) {
    const saved = store.get('notes', null)
    const ta = h('textarea', { class: 'notes', spellcheck: 'false', 'aria-label': 'todo.txt' })
    ta.value = saved ?? t(DEFAULT)
    ta.addEventListener('input', () => store.put('notes', ta.value))
    body.append(ta)
  },
}
