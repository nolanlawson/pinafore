const manifest = require('./manifest/server.js').manifest;
const express = require('express')
const shrinkRay = require('shrink-ray-current')
const sapper = require('sapper')
const serveStatic = require('serve-static')
const app = express()
const helmet = require('helmet')
const uuidv4 = require('uuid/v4')

const headScriptChecksum = require('../inline-script-checksum').checksum

const { PORT } = process.env

// this allows us to do e.g. `fetch('/_api/blog')` on the server
const fetch = require('node-fetch')
global.fetch = (url, opts) => {
  if (url[0] === '/') {
    url = `http://localhost:${PORT}${url}`
  }
  return fetch(url, opts)
}

const debugPaths = ['/report.html', '/stats.json']

const debugOnly = (fn) => (req, res, next) => (
  !~debugPaths.indexOf(req.path) ? next() : fn(req, res, next)
)

const nonDebugOnly = (fn) => (req, res, next) => (
  ~debugPaths.indexOf(req.path) ? next() : fn(req, res, next)
)

app.use(shrinkRay({ threshold: 0 }))

app.use((req, res, next) => {
  res.locals.nonce = uuidv4()
  next()
})

// report.html needs to have CSP disable because it has inline scripts
app.use(debugOnly(helmet()))
app.use(nonDebugOnly(helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: [
        `'self'`,
        `'sha256-${headScriptChecksum}'`,
        (req, res) => `'nonce-${res.locals.nonce}'`
      ],
      workerSrc: [`'self'`],
      styleSrc: [`'self'`, `'unsafe-inline'`],
      frameSrc: [`'none'`],
      objectSrc: [`'none'`],
      manifestSrc: [`'self'`]
    }
  },
  referrerPolicy: {
    policy: 'no-referrer'
  }
})))

app.use(serveStatic('assets', {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public,max-age=600')
  }
}))

debugPaths.forEach(debugPath => {
  app.use(debugPath, express.static(`.sapper/client${debugPath}`))
})

app.use(sapper({ manifest }))

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})

// Handle SIGINT (source: https://git.io/vhJgF)
process.on('SIGINT', function () {
  process.exit(0)
})
