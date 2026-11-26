// Iconos SVG propios de DavidOS (24x24, trazo = currentColor).
const s = (body) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`

export const icons = {
  logo: `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 5h8.5C22 5 27 9.8 27 16s-5 11-11.5 11H7z" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="12" cy="11" r="2.3" fill="currentColor"/><circle cx="12" cy="21" r="2.3" fill="currentColor"/><circle cx="19.5" cy="16" r="2.3" fill="var(--accent2)"/><path d="M12 13.3v5.4M13.8 12.4l4 2.4" stroke="currentColor" stroke-width="1.8" fill="none"/></svg>`,
  readme: s('<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 11h2M10 10v3M13 11h3M9 15h7M9 18h5"/>'),
  deps: s('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/><path d="M8 5.3l8 4.5"/>'),
  repos: s('<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/><circle cx="9" cy="12" r="1.3"/><circle cx="15" cy="15" r="1.3"/><path d="M9 13.3v1.2c0 .8.7 1.5 1.5 1.5h3.2"/>'),
  gitlog: s('<circle cx="7" cy="5" r="2"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="9" r="2"/><path d="M7 7v10M17 11c0 4-10 2-10 6"/>'),
  deploy: s('<path d="M4 12l16-8-6 16-3-6z"/><path d="M11 14l9-10"/>'),
  cv: s('<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M12.5 10v6M10 13.5l2.5 2.5 2.5-2.5M9.5 19h6"/>'),
  duck: s('<path d="M9 9.5a3.5 3.5 0 1 1 6.6 1.6c2.3.2 4.4 1.2 4.4 3.9 0 3-3.2 5-8 5s-8-1.6-8-4.8c0-1.7 1.4-2.6 3.3-2.4"/><path d="M14.8 8.6l3.2-.6-2.6 2"/><circle cx="12.8" cy="8" r=".6" fill="currentColor"/>'),
  bug: s('<rect x="7.5" y="8" width="9" height="11" rx="4.5"/><path d="M9.5 8a2.5 2.5 0 0 1 5 0M12 11v8M4 13h3.5M16.5 13H20M5 8.5l2.8 1.8M19 8.5l-2.8 1.8M5 18l2.8-1.8M19 18l-2.8-1.8"/>'),
  coffee: s('<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H15.6"/><path d="M8 3.5c-.6.8.6 1.6 0 2.5M11 3.5c-.6.8.6 1.6 0 2.5M14 3.5c-.6.8.6 1.6 0 2.5"/>'),
  sysmon: s('<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M6 12h2.5l1.5-3 2 6 1.7-4H18M9 21h6M12 17v4"/>'),
  certs: s('<circle cx="12" cy="9" r="5"/><path d="M9 13.2L7.5 21l4.5-2.5 4.5 2.5-1.5-7.8"/><path d="M10 9l1.4 1.4L14 7.8"/>'),
  shell: s('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 10l3 2.5L7 15M12.5 15.5H17"/>'),
  notes: s('<path d="M5 4h14v10l-6 6H5z"/><path d="M13 20v-6h6M8 8.5h8M8 12h5"/>'),
  about: s('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>'),
  search: s('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/>'),
  download: s('<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14"/>'),
  copy: s('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>'),
  external: s('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
  github: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z"/></svg>`,
  mail: s('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>'),
  branch: s('<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="7" r="2"/><path d="M6 7v10M18 9c0 5-12 3-12 8"/>'),
  globe: s('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z"/>'),
  eye: s('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>'),
  upload: s('<path d="M12 16V4M7.5 8.5L12 4l4.5 4.5M5 19.5h14"/>'),
  power: s('<path d="M12 3v8M7 6.3a7 7 0 1 0 10 0"/>'),
}

export const icon = (name) => icons[name] || icons.about
