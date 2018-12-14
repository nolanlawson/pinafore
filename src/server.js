import * as sapper from '../__sapper__/server.js'
import { checksum as headScriptChecksum } from '../inline-script-checksum.json'
import express from 'express'
import compression from 'compression'
import serveStatic from 'serve-static'
import helmet from 'helmet'
import uuidv4 from 'uuid/v4'
import fetch from 'node-fetch'

const app = express()

const { PORT = 4002 } = process.env

// this allows us to do e.g. `fetch('/_api/blog')` on the server
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
        `'unsafe-inline'`,
        `'unsafe-eval'`
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

app.use(serveStatic('static', {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public,max-age=600')
  }
}))

debugPaths.forEach(debugPath => {
  app.use(debugPath, express.static(`__sapper__/build/client${debugPath}`))
})

app.use(sapper.middleware())

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})

// Handle SIGINT (source: https://git.io/vhJgF)
process.on('SIGINT', function () {
  process.exit(0)
})
