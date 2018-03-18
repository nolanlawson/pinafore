import express from 'express'
import compression from 'compression'
import sapper from 'sapper'
import serveStatic from 'serve-static'
import { routes } from './manifest/server.js'

const app = express()

const { PORT = 4002 } = process.env

// this allows us to do e.g. `fetch('/_api/blog')` on the server
const fetch = require('node-fetch')
global.fetch = (url, opts) => {
  if (url[0] === '/') url = `http://localhost:${PORT}${url}`
  return fetch(url, opts)
}

app.use(compression({ threshold: 0 }))

app.use(serveStatic('assets'))

app.use(sapper({ routes }))

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
