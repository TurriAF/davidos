// Fuente única del contenido. Todo lo que se ve en DavidOS sale de aquí.
// Para editar textos, niveles o enlaces, toca solo este archivo.

export const person = {
  name: 'David Aguilar Fernández',
  short: 'David',
  initials: 'DA',
  photo: 'david.webp',
  role: { es: 'Desarrollador web junior', en: 'Junior web developer' },
  tagline: {
    es: 'Java, PHP, JavaScript y SQL, de la interfaz a la base de datos.',
    en: 'Java, PHP, JavaScript and SQL, from the interface to the database.',
  },
  location: { es: 'Almería, España · disponible en remoto', en: 'Almería, Spain · open to remote work' },
  available: { es: 'Disponible', en: 'Available' },
  about: {
    es: 'Técnico Superior en Desarrollo de Aplicaciones Web y Técnico en Sistemas Microinformáticos y Redes. Me gusta entender cómo encaja cada pieza, del código al servidor, y resolver problemas con calma.',
    en: 'Higher Vocational Degree in Web Application Development (DAW) and Vocational Diploma in Microcomputer Systems and Networks (SMR). I like understanding how every piece fits, from code to server, and solving problems calmly.',
  },
  email: 'david34512@gmail.com',
  linkedin: 'https://www.linkedin.com/in/david-aguilar-fern%C3%A1ndez-52836b248/',
  github: 'https://github.com/TurriAF',
  githubUser: 'TurriAF',
}

// Niveles del 1 al 5 (1 básico · 2 iniciado · 3 intermedio · 4 avanzado · 5 experto).
// Calibrados para alguien recién titulado en el Grado Superior de DAW.
export const skills = {
  dev: [
    { name: 'html-css', label: 'HTML & CSS', level: 4, cat: 'web' },
    { name: 'java', label: 'Java', level: 3, cat: 'prog' },
    { name: 'javascript', label: 'JavaScript', level: 3, cat: 'prog' },
    { name: 'php', label: 'PHP', level: 3, cat: 'prog' },
    { name: 'sql', label: 'SQL · MySQL', level: 3, cat: 'db' },
    { name: 'xml', label: 'XML', level: 3, cat: 'web' },
    { name: 'git', label: 'Git · GitLab', level: 3, cat: 'tools' },
  ],
  ops: [
    { name: 'windows', label: 'Windows', level: 3 },
    { name: 'networking', label: { es: 'Redes', en: 'Networking' }, level: 3 },
    { name: 'active-directory', label: 'Active Directory', level: 2 },
    { name: 'aws', label: { es: 'AWS (básico)', en: 'AWS (basic)' }, level: 1 },
  ],
}

export const skillCats = {
  prog: { es: 'Programación', en: 'Programming' },
  web: { es: 'Desarrollo web', en: 'Web development' },
  db: { es: 'Bases de datos', en: 'Databases' },
  tools: { es: 'Herramientas', en: 'Tools' },
  ops: { es: 'Sistemas y redes', en: 'Systems & networks' },
}

export const languages = [
  { name: { es: 'Español', en: 'Spanish' }, level: { es: 'Nativo', en: 'Native' } },
  { name: { es: 'Inglés', en: 'English' }, level: { es: 'B1 · Cambridge PET (153)', en: 'B1 · Cambridge PET (153)' } },
]

// Ficha "En 30 segundos" para RR. HH.
export const summary = [
  { k: { es: 'Puesto', en: 'Role' }, v: { es: 'Desarrollador web junior', en: 'Junior web developer' } },
  { k: { es: 'Disponibilidad', en: 'Availability' }, v: { es: 'Incorporación inmediata', en: 'Can start immediately' } },
  { k: { es: 'Modalidad', en: 'Work mode' }, v: { es: 'Presencial en Almería o remoto', en: 'On-site in Almería or remote' } },
  { k: { es: 'Formación', en: 'Education' }, v: { es: 'Técnico Superior en DAW + Técnico en SMR', en: 'Web App Development (higher degree) + Systems & Networks' } },
  { k: { es: 'Experiencia', en: 'Experience' }, v: { es: 'Michelin, Sumática y Erasmus+ en Italia', en: 'Michelin, Sumática and Erasmus+ in Italy' } },
  { k: { es: 'Idiomas', en: 'Languages' }, v: { es: 'Español nativo · Inglés B1', en: 'Spanish native · English B1' } },
]

export const whyMe = [
  {
    t: { es: 'Base técnica completa', en: 'Full technical foundation' },
    d: { es: 'Programación web (DAW) y sistemas y redes (SMR): entiendo una aplicación del código al servidor.', en: 'Web development (DAW) plus systems and networks (SMR): I understand an app from code to server.' },
  },
  {
    t: { es: 'Experiencia real en empresa', en: 'Real company experience' },
    d: { es: 'Programación en Michelin con GitLab, instalaciones en Sumática y prácticas Erasmus+ en Italia.', en: 'Programming at Michelin with GitLab, installations at Sumática and an Erasmus+ internship in Italy.' },
  },
  {
    t: { es: 'Resuelvo problemas reales', en: 'I solve real problems' },
    d: { es: 'AulaCheck nació de mi trabajo en colegios: vi un problema y construí la herramienta.', en: 'AulaCheck was born from my work in schools: I saw a problem and built the tool.' },
  },
]

// Ordenado del más reciente al más antiguo (como un git log).
// lane: 'main' = desarrollo/formación, 'ops' = sistemas y soporte
export const timeline = [
  {
    id: 'sumatica', lane: 'ops', kind: 'work',
    org: 'Sumática',
    title: { es: 'Técnico informático', en: 'IT technician' },
    date: { es: 'oct 2025 – ene 2026', en: 'Oct 2025 – Jan 2026' },
    msg: { es: 'merge: técnico informático en Sumática', en: 'merge: IT technician at Sumática' },
    lines: {
      es: ['Montaje e instalación de soportes y pantallas interactivas en centros educativos', 'Configuración de las pantallas e integración en la red del centro', 'Comprobación del funcionamiento y resolución de incidencias', 'Coordinación con el personal del centro y planificación de instalaciones'],
      en: ['Mounted and installed brackets and interactive displays in schools', 'Configured the displays and integrated them into the school network', 'Verified every unit and solved incidents', 'Coordinated with school staff and planned installations'],
    },
  },
  {
    id: 'michelin', lane: 'main', kind: 'work',
    org: 'Michelin',
    title: { es: 'Prácticas de FP · Programación', en: 'Vocational internship · Programming' },
    date: { es: 'mar – jun 2025', en: 'Mar – Jun 2025' },
    msg: { es: 'feat: prácticas de programación en Michelin', en: 'feat: programming internship at Michelin' },
    lines: {
      es: ['Programación en un lenguaje propio para las máquinas del centro', 'Trabajo en equipo con GitLab: control de versiones y flujos profesionales', 'Cómo se estructuran proyectos reales en una gran empresa industrial'],
      en: ['Programming in a proprietary language for the plant machines', 'Teamwork with GitLab: version control and professional workflows', 'How real projects are structured in a large industrial company'],
    },
  },
  {
    id: 'daw', lane: 'main', kind: 'edu', tag: 'v2.0',
    org: 'Medac',
    title: { es: 'Técnico Superior en Desarrollo de Aplicaciones Web', en: 'Higher Vocational Degree in Web Application Development (DAW)' },
    date: { es: 'sep 2023 – jun 2025', en: 'Sep 2023 – Jun 2025' },
    msg: { es: 'release: Técnico Superior en DAW', en: 'release: Web Application Development degree' },
    lines: {
      es: ['Java, PHP, JavaScript, HTML, CSS y XML', 'Diseño y gestión de bases de datos con SQL y MySQL', 'Diseño de interfaces y webs dinámicas', 'Despliegue de aplicaciones y Active Directory'],
      en: ['Java, PHP, JavaScript, HTML, CSS and XML', 'Database design and management with SQL and MySQL', 'Interface design and dynamic websites', 'Application deployment and Active Directory'],
    },
  },
  {
    id: 'genova', lane: 'ops', kind: 'work',
    org: "Leo's Computer Srl · Génova 🇮🇹",
    title: { es: 'Prácticas Erasmus+', en: 'Erasmus+ internship' },
    date: { es: 'sep – dic 2022', en: 'Sep – Dec 2022' },
    msg: { es: 'feat(erasmus): soporte técnico en Génova', en: 'feat(erasmus): tech support in Genoa' },
    lines: {
      es: ['Soporte técnico y mantenimiento de equipos y redes', 'Estancia formativa en Italia'],
      en: ['Technical support and maintenance of equipment and networks', 'Training stay in Italy'],
    },
  },
  {
    id: 'smr', lane: 'main', kind: 'edu', tag: 'v1.0',
    org: { es: 'Grado Medio', en: 'Intermediate vocational degree' },
    title: { es: 'Técnico en Sistemas Microinformáticos y Redes', en: 'Vocational Diploma in Microcomputer Systems and Networks (SMR)' },
    date: { es: 'Grado Medio', en: 'Intermediate degree' },
    msg: { es: 'initial commit: Técnico en SMR', en: 'initial commit: Microcomputer Systems & Networks' },
    lines: { es: ['Soporte, equipos y redes'], en: ['Support, hardware and networks'] },
  },
]

export const certs = [
  {
    id: 'b1', subject: 'Cambridge English: B1 Preliminary (PET)', issuer: 'Cambridge Assessment English',
    detail: { es: 'Grade B · puntuación 153', en: 'Grade B · score 153' },
    date: '31/07/2026', serial: 'D7987816',
  },
  {
    id: 'aws', subject: 'AWS Cloud Quest: Cloud Practitioner', issuer: 'Amazon Web Services',
    detail: { es: 'Creación de soluciones básicas con servicios de AWS y conceptos fundamentales de la nube', en: 'Building basic solutions with AWS services and core cloud concepts' },
    date: null, serial: null,
  },
]

// Los proyectos están en projects.json (se editan con el panel "Subir proyecto" en local).
