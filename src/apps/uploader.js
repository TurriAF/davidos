// Subir proyecto: SOLO en `npm run dev`. Guarda en src/data/projects.json y public/projects/.
import { h, t } from '../os/core.js'
import { toast } from '../os/notify.js'
import { getProjects, setProjects, imageUrl } from '../os/projects.js'
import { icons } from '../os/icons.js'

const SUGGEST = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'PHP', 'Java', 'SQL', 'MySQL', 'XML', 'React', 'Astro', 'Tailwind', 'Vite', 'Node.js', 'Express', 'Laravel', 'Spring Boot', 'Bootstrap', 'API REST', 'Git', 'Docker', 'AWS', 'SQLite', 'Canvas']
let editing = null // id en edición o null

const slug = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)

async function api(method, url, data) {
  const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: data ? JSON.stringify(data) : undefined })
  const json = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(json.error || r.statusText)
  return json
}

export default {
  id: 'uploader',
  file: 'subir-proyecto',
  icon: 'upload',
  lane: 'cv',
  name: { es: 'Subir proyecto', en: 'Upload project' },
  keywords: ['subir', 'upload', 'proyecto', 'project', 'añadir', 'add', 'admin'],
  w: 860,
  h: 620,
  noGutter: true,
  render(body, ctx) {
    const list = getProjects()
    const p = editing ? list.find((x) => x.id === editing) : null
    let imageData = null
    let stack = p ? [...p.stack] : []

    // ---- lista lateral ----
    const move = async (id, d) => {
      const order = list.map((x) => x.id)
      const i = order.indexOf(id)
      const j = i + d
      if (j < 0 || j >= order.length) return
      ;[order[i], order[j]] = [order[j], order[i]]
      try {
        setProjects(await api('PUT', '/__projects', { order }))
        ctx.rerender()
      } catch (e) {
        toast(e.message, { icon: '!', tone: 'warn' })
      }
    }
    const del = async (id) => {
      const b = body.querySelector(`[data-del="${id}"]`)
      if (!b.dataset.confirm) {
        b.dataset.confirm = '1'
        b.textContent = t({ es: '¿Seguro?', en: 'Sure?' })
        setTimeout(() => {
          if (b.isConnected) {
            delete b.dataset.confirm
            b.textContent = '🗑'
          }
        }, 2500)
        return
      }
      try {
        setProjects(await api('DELETE', '/__projects?id=' + encodeURIComponent(id)))
        if (editing === id) editing = null
        toast({ es: 'Proyecto borrado', en: 'Project deleted' }, { icon: '🗑' })
        ctx.rerender()
      } catch (e) {
        toast(e.message, { icon: '!', tone: 'warn' })
      }
    }
    const side = h(
      'aside',
      { class: 'up-side' },
      h('button', { class: `btn small ${!editing ? 'primary' : ''}`, type: 'button', onClick: () => ((editing = null), ctx.rerender()) }, '+ ' + t({ es: 'Nuevo proyecto', en: 'New project' })),
      h(
        'ul',
        { class: 'up-list' },
        list.map((x, i) =>
          h(
            'li',
            { class: x.id === editing ? 'on' : '' },
            h('button', { type: 'button', class: 'up-item', onClick: () => ((editing = x.id), ctx.rerender()) }, imageUrl(x) ? h('img', { src: imageUrl(x), alt: '' }) : h('span', { class: 'up-noimg' }, '?'), h('span', {}, t(x.title))),
            h(
              'span',
              { class: 'up-ops' },
              h('button', { type: 'button', title: '↑', disabled: i === 0, onClick: () => move(x.id, -1) }, '↑'),
              h('button', { type: 'button', title: '↓', disabled: i === list.length - 1, onClick: () => move(x.id, 1) }, '↓'),
              h('button', { type: 'button', 'data-del': x.id, title: t({ es: 'Borrar', en: 'Delete' }), onClick: () => del(x.id) }, '🗑'),
            ),
          ),
        ),
      ),
    )

    // ---- formulario ----
    const field = (label, input, hint) => h('label', { class: 'up-field' }, h('span', { class: 'up-label' }, label), input, hint ? h('span', { class: 'up-hint' }, hint) : null)
    const inp = (name, value = '', attrs = {}) => h('input', { class: 'up-input', name, value: value ?? '', ...attrs })
    const area = (name, value = '') => {
      const a = h('textarea', { class: 'up-input', name, rows: 3 })
      a.value = value ?? ''
      return a
    }

    const titleEs = inp('titleEs', p?.title.es, { required: true, maxlength: 80, placeholder: 'Buscador de películas' })
    const idIn = inp('id', p?.id, { required: true, pattern: '[a-z0-9][a-z0-9-]*', maxlength: 40, placeholder: 'movie-search' })
    titleEs.addEventListener('input', () => {
      if (!p && !idIn.dataset.touched) idIn.value = slug(titleEs.value)
    })
    idIn.addEventListener('input', () => (idIn.dataset.touched = '1'))

    // Imagen
    const preview = h('div', { class: 'up-preview' })
    const showPreview = (src) => preview.replaceChildren(src ? h('img', { src, alt: '' }) : h('span', { class: 'muted small' }, t({ es: 'Arrastra aquí la imagen de shots.so o haz clic', en: 'Drop your shots.so image here or click' })))
    showPreview(imageUrl(p))
    const file = h('input', { type: 'file', accept: 'image/png,image/jpeg,image/webp', hidden: true })
    const takeFile = (f) => {
      if (!f) return
      if (!/^image\/(png|jpeg|webp)$/.test(f.type)) return toast({ es: 'Usa PNG, JPG o WEBP', en: 'Use PNG, JPG or WEBP' }, { icon: '!', tone: 'warn' })
      if (f.size > 3 * 1024 * 1024) return toast({ es: 'La imagen pesa más de 3 MB. Exporta desde shots.so en WEBP o a menor escala.', en: 'Image is over 3 MB. Export from shots.so as WEBP or smaller.' }, { icon: '!', tone: 'warn' })
      const rd = new FileReader()
      rd.onload = () => {
        imageData = { name: f.name, dataUrl: rd.result }
        showPreview(rd.result)
      }
      rd.readAsDataURL(f)
    }
    file.addEventListener('change', () => takeFile(file.files[0]))
    const drop = h('div', { class: 'up-drop', tabindex: '0', role: 'button', onClick: () => file.click(), onKeydown: (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), file.click()) }, preview, file)
    drop.addEventListener('dragover', (e) => (e.preventDefault(), drop.classList.add('over')))
    drop.addEventListener('dragleave', () => drop.classList.remove('over'))
    drop.addEventListener('drop', (e) => {
      e.preventDefault()
      drop.classList.remove('over')
      takeFile(e.dataTransfer.files[0])
    })

    // Tecnologías (chips)
    const chipsBox = h('div', { class: 'chips up-chips' })
    const stackIn = h('input', { class: 'up-input', list: 'up-suggest', placeholder: t({ es: 'Escribe y pulsa Enter (p. ej. PHP)', en: 'Type and press Enter (e.g. PHP)' }) })
    const paintChips = () =>
      chipsBox.replaceChildren(...stack.map((s, i) => h('button', { type: 'button', class: 'chip dev up-chip', title: t({ es: 'Quitar', en: 'Remove' }), onClick: () => (stack.splice(i, 1), paintChips()) }, s, ' ×')))
    paintChips()
    const addTech = () => {
      const v = stackIn.value.trim().replace(/,$/, '')
      if (v && !stack.includes(v) && stack.length < 12) stack.push(v)
      stackIn.value = ''
      paintChips()
    }
    stackIn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault()
        addTech()
      }
    })
    stackIn.addEventListener('change', () => SUGGEST.includes(stackIn.value) && addTech())

    const status = h('select', { class: 'up-input', name: 'status' }, h('option', { value: 'live' }, t({ es: 'Publicado', en: 'Live' })), h('option', { value: 'wip' }, t({ es: 'En desarrollo', en: 'In progress' })))
    status.value = p?.status || 'live'

    const saveBtn = h('button', { class: 'btn primary', type: 'submit' }, h('span', { html: icons.upload }), p ? t({ es: 'Guardar cambios', en: 'Save changes' }) : t({ es: 'Subir proyecto', en: 'Upload project' }))
    const form = h(
      'form',
      {
        class: 'up-form',
        onSubmit: async (e) => {
          e.preventDefault()
          addTech()
          const fd = new FormData(form)
          const project = {
            id: idIn.value.trim(),
            originalId: p?.id,
            title: { es: fd.get('titleEs').trim(), en: fd.get('titleEn').trim() },
            desc: { es: fd.get('descEs').trim(), en: fd.get('descEn').trim() },
            stack,
            github: fd.get('github').trim() || null,
            demo: fd.get('demo').trim() || null,
            status: status.value,
          }
          saveBtn.disabled = true
          try {
            const next = await api('POST', '/__projects', { project, image: imageData })
            setProjects(next)
            editing = project.id
            toast({ es: `"${project.title.es}" guardado en projects.json`, en: `"${project.title.es}" saved to projects.json` }, { icon: '✓', tone: 'ok' })
            ctx.rerender()
            ctx.open('repos')
          } catch (err) {
            toast(err.message, { icon: '!', tone: 'warn', ms: 6000 })
          } finally {
            saveBtn.disabled = false
          }
        },
      },
      h('p', { class: 'up-note small' }, '🔒 ', t({ es: 'Este panel solo existe en tu PC (npm run dev). No aparece en la web publicada.', en: 'This panel only exists on your PC (npm run dev). It is not in the published site.' })),
      field(t({ es: 'Imagen (shots.so)', en: 'Image (shots.so)' }), drop, t({ es: 'Recomendado: 1600×1000 px, WEBP, máx. 3 MB', en: 'Recommended: 1600×1000 px, WEBP, max 3 MB' })),
      h('div', { class: 'up-row' }, field(t({ es: 'Título (ES) *', en: 'Title (ES) *' }), titleEs), field(t({ es: 'Título (EN)', en: 'Title (EN)' }), inp('titleEn', p?.title.en, { maxlength: 80, placeholder: 'Movie search' }))),
      h('div', { class: 'up-row' }, field(t({ es: 'Descripción (ES)', en: 'Description (ES)' }), area('descEs', p?.desc.es)), field(t({ es: 'Descripción (EN)', en: 'Description (EN)' }), area('descEn', p?.desc.en))),
      field(t({ es: 'Tecnologías', en: 'Tech stack' }), h('div', {}, chipsBox, stackIn, h('datalist', { id: 'up-suggest' }, SUGGEST.map((s) => h('option', { value: s }))))),
      h('div', { class: 'up-row' }, field('GitHub', inp('github', p?.github, { type: 'url', placeholder: 'https://github.com/TurriAF/...' })), field(t({ es: 'Demo (opcional)', en: 'Demo (optional)' }), inp('demo', p?.demo, { type: 'url', placeholder: 'https://...' }))),
      h('div', { class: 'up-row' }, field('id (URL)', idIn), field(t({ es: 'Estado', en: 'Status' }), status)),
      h('div', { class: 'actions' }, saveBtn, h('button', { class: 'btn ghost', type: 'button', onClick: () => ctx.open('repos') }, t({ es: 'Ver proyectos', en: 'See projects' }))),
    )

    body.append(h('div', { class: 'uploader' }, side, form))
  },
}
