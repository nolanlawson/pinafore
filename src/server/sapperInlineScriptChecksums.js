// TODO: this is a hacky solution to generating checksums for Sapper's inline scripts.
// I determined this by running `sapper export` and then checking all unique inline scripts.
// Really, this ought to be built into Sapper somehow.

import crypto from 'crypto'

let scripts = [
  `__SAPPER__={baseUrl:"",preloaded:[{},{}]};`,
  `__SAPPER__={baseUrl:"",preloaded:[{}]};`,
  `__SAPPER__={baseUrl:"",preloaded:[{},null,null,{}]};`,
  `__SAPPER__={baseUrl:"",preloaded:[{},null,{}]};`
]

if (process.env.NODE_ENV === 'production') {
  // sapper adds service worker only in production
  scripts = scripts.map(script => `${script}if('serviceWorker' in navigator)navigator.serviceWorker.register('/service-worker.js');`)
}

export const sapperInlineScriptChecksums = scripts.map(script => {
  return crypto.createHash('sha256').update(script).digest('base64')
})
