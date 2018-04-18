const express = require('express')
const compression = require('compression')
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

app.use(compression({ threshold: 0 }))

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

app.use(sapper())

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
