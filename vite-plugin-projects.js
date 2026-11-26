// Plugin SOLO de desarrollo: API local para el panel "Subir proyecto".
// No existe en el build publicado (apply: 'serve').
import fs from 'node:fs/promises'
import path from 'node:path'

const MAX_IMG = 3 * 1024 * 1024
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }

export default function projectsPlugin() {
  let root
  return {
    name: 'davidos-projects',
    apply: 'serve',
    configResolved(c) {
      root = c.root
    },
    configureServer(server) {
      const jsonPath = path.join(root, 'src/data/projects.json')
      const imgDir = path.join(root, 'public/projects')
      const read = async () => JSON.parse(await fs.readFile(jsonPath, 'utf8'))
      const write = (list) => fs.writeFile(jsonPath, JSON.stringify(list, null, 2) + '\n', 'utf8')
      const send = (res, code, body) => {
        res.statusCode = code
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(body))
      }
      const body = (req) =>
        new Promise((resolve, reject) => {
          let size = 0
          const chunks = []
          req.on('data', (c) => {
            size += c.length
            if (size > 6 * 1024 * 1024) reject(new Error('Body too large'))
            else chunks.push(c)
          })
          req.on('end', () => {
            try {
              resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'))
            } catch (e) {
              reject(e)
            }
          })
          req.on('error', reject)
        })

      server.middlewares.use('/__projects', async (req, res) => {
        try {
          if (req.method === 'GET') return send(res, 200, await read())

          if (req.method === 'POST') {
            const { project: p, image } = await body(req)
            const id = String(p?.id || '').toLowerCase()
            if (!/^[a-z0-9][a-z0-9-]{0,40}$/.test(id)) return send(res, 400, { error: 'id inválido (minúsculas, números y guiones)' })
            if (!p.title?.es) return send(res, 400, { error: 'Falta el título' })
            if (p.github && !/^https:\/\/github\.com\/[\w.-]+(\/[\w.-]+)?\/?$/.test(p.github)) return send(res, 400, { error: 'El enlace de GitHub debe empezar por https://github.com/' })
            if (p.demo && !/^https?:\/\/\S+$/.test(p.demo)) return send(res, 400, { error: 'El enlace de la demo no es válido' })

            const list = await read()
            const prev = list.find((x) => x.id === (p.originalId || id))
            let imageName = prev?.image ?? null
            if (image?.dataUrl) {
              const m = /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/.exec(image.dataUrl)
              if (!m) return send(res, 400, { error: 'La imagen debe ser PNG, JPG o WEBP' })
              const buf = Buffer.from(m[2], 'base64')
              if (buf.length > MAX_IMG) return send(res, 400, { error: 'La imagen pesa más de 3 MB' })
              await fs.mkdir(imgDir, { recursive: true })
              if (prev?.image) await fs.rm(path.join(imgDir, path.basename(prev.image)), { force: true })
              imageName = `${id}.${EXT[m[1]]}`
              await fs.writeFile(path.join(imgDir, imageName), buf)
            }
            const clean = {
              id,
              name: id,
              title: { es: String(p.title.es).slice(0, 80), en: String(p.title.en || p.title.es).slice(0, 80) },
              desc: { es: String(p.desc?.es || '').slice(0, 600), en: String(p.desc?.en || p.desc?.es || '').slice(0, 600) },
              image: imageName,
              stack: (Array.isArray(p.stack) ? p.stack : []).map((s) => String(s).trim().slice(0, 30)).filter(Boolean).slice(0, 12),
              github: p.github || null,
              demo: p.demo || null,
              status: p.status === 'wip' ? 'wip' : 'live',
              updated: Date.now(),
            }
            const idx = list.findIndex((x) => x.id === (p.originalId || id))
            if (idx >= 0) list[idx] = clean
            else if (list.some((x) => x.id === id)) return send(res, 409, { error: 'Ya existe un proyecto con ese id' })
            else list.unshift(clean)
            await write(list)
            return send(res, 200, list)
          }

          if (req.method === 'DELETE') {
            const id = new URL(req.url, 'http://x').searchParams.get('id')
            const list = await read()
            const p = list.find((x) => x.id === id)
            if (!p) return send(res, 404, { error: 'No existe' })
            if (p.image) await fs.rm(path.join(imgDir, path.basename(p.image)), { force: true })
            const next = list.filter((x) => x.id !== id)
            await write(next)
            return send(res, 200, next)
          }

          if (req.method === 'PUT') {
            // Reordenar: { order: [id, id, ...] }
            const { order } = await body(req)
            const list = await read()
            const next = [...list].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
            await write(next)
            return send(res, 200, next)
          }

          send(res, 405, { error: 'Método no permitido' })
        } catch (e) {
          send(res, 500, { error: e.message })
        }
      })
    },
  }
}
