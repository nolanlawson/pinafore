// TODO: this is a hacky solution to generating checksums for Sapper's inline scripts.
// I determined this by running `sapper export` and then checking all unique inline scripts.
// Really, this ought to be built into Sapper somehow.

import crypto from 'crypto'

const baseScripts = [
  '__SAPPER__={baseUrl:"",preloaded:[{},{}]};',
  '__SAPPER__={baseUrl:"",preloaded:[{}]};',
  '__SAPPER__={baseUrl:"",preloaded:[{},null,null,{}]};',
  '__SAPPER__={baseUrl:"",preloaded:[{},null,{}]};'
]

const scriptsWithSW = baseScripts.map(script => (
  `${script}if('serviceWorker' in navigator)navigator.serviceWorker.register('/service-worker.js');`)
)

// sapper adds service worker usually, but it seems inconsistent in dev mode especially
const scripts = [].concat(baseScripts).concat(scriptsWithSW)

export const sapperInlineScriptChecksums = scripts.map(script => {
  return crypto.createHash('sha256').update(script, 'utf8').digest('base64')
})
