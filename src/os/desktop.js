// Iconos del escritorio.
import { h, t, state, on } from './core.js'
import { icon } from './icons.js'
import { getApps, open } from './windowManager.js'
import { initSelection } from './selection.js'

export function initDesktopIcons(root) {
  const grid = h('div', { class: 'icons', role: 'list' })
  root.append(grid)

  function paint() {
    const r = state.branch === 'ops' ? { ops: 0, dev: 1, cv: 2, fun: 3, sys: 4 } : { dev: 0, cv: 1, ops: 2, fun: 3, sys: 4 }
    const apps = getApps()
      .filter((a) => a.desktop !== false)
      .sort((a, b) => (r[a.lane] ?? 9) - (r[b.lane] ?? 9))
    grid.replaceChildren(
      ...apps.map((a, i) =>
        h(
          'button',
          {
            class: `dicon lane-${a.lane}`,
            type: 'button',
            role: 'listitem',
            'data-app': a.id,
            style: { '--i': i },
            title: t(a.name),
            onClick: () => open(a.id),
          },
          h('span', { class: 'dicon-tile', html: icon(a.icon) }),
          h('span', { class: 'dicon-name' }, t(a.name)),
          h('span', { class: 'dicon-file' }, a.file),
        ),
      ),
    )
  }
  on('branch', paint)
  on('lang', paint)
  paint()
  initSelection(root)
}
