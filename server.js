const express = require('express')
const shrinkRay = require('shrink-ray-current')
const sapper = require('sapper')
const serveStatic = require('serve-static')
const app = express()
const helmet = require('helmet')

const headScriptChecksum = require('./inline-script-checksum').checksum

const { PORT = 4002 } = process.env

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

app.use(shrinkRay({threshold: 0}))

// report.html needs to have CSP disable because it has inline scripts
app.use(debugOnly(helmet()))
app.use(nonDebugOnly(helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: [`'self'`, `'sha256-${headScriptChecksum}'`],
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

// TODO: remove this hack when Safari works with cross-origin window.open()
// in a PWA: https://github.com/nolanlawson/pinafore/issues/45
app.get('/manifest.json', (req, res, next) => {
  if (/iP(?:hone|ad|od)/.test(req.headers['user-agent'])) {
    return res.status(404).send({
      error: 'manifest.json is disabled for iOS. see https://github.com/nolanlawson/pinafore/issues/45'
    })
  }
  return next()
})

app.use(serveStatic('assets', {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public,max-age=600')
  }
}))

debugPaths.forEach(debugPath => {
  app.use(debugPath, express.static(`.sapper/client${debugPath}`))
})

app.use(sapper())

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})

// Handle SIGINT (source: https://git.io/vhJgF)
process.on('SIGINT', function () {
  process.exit(0)
})
