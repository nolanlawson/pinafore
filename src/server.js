import * as sapper from '../__sapper__/server.js'
import express from 'express'
import compression from 'compression'
import serveStatic from 'serve-static'
import helmet from 'helmet'
import fetch from 'node-fetch'
import inlineScriptChecksum from './inline-script/checksum'
import { sapperInlineScriptChecksums } from './server/sapperInlineScriptChecksums'

const { PORT = 4002 } = process.env
const app = express()

const MAX_AGE = 3600

// this allows us to do e.g. `fetch('/_api/blog')` on the server
global.fetch = (url, opts) => {
  if (url[0] === '/') {
    url = `http://localhost:${PORT}${url}`
  }
  return fetch(url, opts)
}

app.use(compression({ threshold: 0 }))

// CSP only needs to apply to core HTML files, not debug files
// like report.html or the JS/CSS/JSON/image files
const coreHtmlFilesOnly = (fn) => (req, res, next) => {
  let coreHtml = !/\.(js|css|json|png|svg|jpe?g|map)$/.test(req.path) &&
    !(/\/report.html/.test(req.path))
  return coreHtml ? fn(req, res, next) : next()
}

app.use(coreHtmlFilesOnly(helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: [
        `'self'`,
        `'sha256-${inlineScriptChecksum}'`,
        ...sapperInlineScriptChecksums.map(_ => `'sha256-${_}'`)
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
    res.setHeader('Cache-Control', `public,max-age=${MAX_AGE}`)
  }
}))

app.use(express.static('__sapper__/build/client/report.html'))
app.use(express.static('__sapper__/build/client/stats.json'))

// TODO: hack to override Sapper's default max-age of 600 for HTML files
function overrideSetHeader (req, res, next) {
  const origSetHeader = res.setHeader
  res.setHeader = function (key, value) {
    if (key === 'Cache-Control' && value === 'max-age=600') {
      return origSetHeader.apply(this, ['Cache-Control', `max-age=${MAX_AGE}`])
    }
    return origSetHeader.apply(this, arguments)
  }
  return next()
}

app.use(overrideSetHeader, sapper.middleware())

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})

// Handle SIGINT (source: https://git.io/vhJgF)
process.on('SIGINT', function () {
  process.exit(0)
})
