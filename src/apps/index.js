// Registro de apps. Para añadir una app nueva: crea su archivo y añádela aquí.
import readme from './readme.js'
import deps from './deps.js'
import repos from './repos.js'
import gitlog from './gitlog.js'
import deploy from './deploy.js'
import cv from './cvviewer.js'
import sysmon from './sysmon.js'
import certs from './certs.js'
import duck from './duck.js'
import bugsquash from './bugsquash.js'
import coffee from './coffee.js'
import shell from './shell.js'
import notes from './notes.js'
import about from './about.js'
import uploader from './uploader.js'
import welcome from './welcome.js'

// El panel de subida solo existe en desarrollo (npm run dev); en el build se elimina.
export default [readme, deps, repos, gitlog, deploy, cv, ...(import.meta.env.DEV ? [uploader] : []), sysmon, certs, duck, bugsquash, coffee, shell, notes, about, welcome]
