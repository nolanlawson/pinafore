import { findall } from '../src/routes/_utils/findall'
import crypto from 'crypto'
import express from 'express'
import compression from 'compression'
import serveStatic from 'serve-static'
import helmet from 'helmet'
import fs from 'fs'
import path from 'path'
import { walk } from './utils/walk'

const { PORT = 4002 } = process.env
const exportDir = path.resolve(__dirname, '../__sapper__/export')

const app = express()
const inlineScriptChecksums = new Set()

walk(exportDir, file => {
  if (!file.endsWith('.html')) {
    return
  }
  let html = fs.readFileSync(file, 'utf8')
  let scripts = findall(html, /<script.*?>([\s\S]*?)<\/script>/g)
  for (let script of scripts) {
    let checksum = crypto.createHash('sha256').update(script).digest('base64')
    inlineScriptChecksums.add(checksum)
  }
})

app.use(compression({ threshold: 0 }))

// CSP is useless for non-HTML resources
const htmlOnly = fn => (req, res, next) => (
  /\.(js|css|png|svg|json|map)$/.test(req.path) ? next() : fn(req, res, next)
)

app.use(htmlOnly(helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: [`'self'`, ...[...inlineScriptChecksums].map(_ => `'sha256-${_}'`)],
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

app.use(serveStatic(exportDir, {
  maxAge: '4h',
  setHeaders: (res, path) => {
    if (path.endsWith('/service-worker.js')) {
      res.setHeader('Cache-Control', 'public, max-age=0')
    } else if (/\/client\/[^/]+\//.test(path)) {
      res.setHeader('Cache-Control', 'public, max-age=31557600, immutable')
    } else if (/^image\//.test(serveStatic.mime.lookup(path))) {
      res.setHeader('Cache-Control', 'public, max-age=604800')
    }
  }
}))

app.get('/report.html', (req, res) => res.redirect('/client/report.html'))
app.get('/stats.json', (req, res) => res.redirect('/client/stats.json'))

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})

// Handle SIGINT (source: https://git.io/vhJgF)
process.on('SIGINT', function () {
  process.exit(0)
})
