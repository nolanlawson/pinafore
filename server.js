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
  if (url[0] === '/') url = `http://localhost:${PORT}${url}`
  return fetch(url, opts)
}

app.use(compression({ threshold: 0 }))

app.use(helmet({
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
}))

app.use(serveStatic('assets', {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public,max-age=600')
  }
}))

app.use('/report.html', express.static('.sapper/client/report.html'))
app.use('/stats.json', express.static('.sapper/client/stats.json'))

app.use(sapper())

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
