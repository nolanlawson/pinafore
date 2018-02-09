const app = require('express')()
const compression = require('compression')
const sapper = require('sapper')
const serveStatic = require('serve-static')

const { PORT = 4002 } = process.env

// this allows us to do e.g. `fetch('/_api/blog')` on the server
const fetch = require('node-fetch')
global.fetch = (url, opts) => {
  if (url[0] === '/') url = `http://localhost:${PORT}${url}`
  return fetch(url, opts)
}

app.use(compression({ threshold: 0 }))

app.use(serveStatic('assets'))

app.use(sapper())

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
