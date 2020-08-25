#!/usr/bin/env node

const path = require('path')
const express = require('express')
const compression = require('compression')
const { routes: rawRoutes } = require('./vercel.json')

const { PORT = 4002 } = process.env
const app = express()
const exportDir = path.resolve(__dirname, '__sapper__/export')

const routes = rawRoutes.map(({ src, headers, dest }) => ({
  regex: new RegExp(src),
  headers,
  dest
}))

app.use(compression({ threshold: 0 }))

app.use(express.static(exportDir, {
  setHeaders (res, thisPath) {
    const localPath = '/' + path.relative(exportDir, thisPath)
    for (const { regex, headers } of routes) {
      if (regex.test(localPath)) {
        res.set(headers)
        return
      }
    }
  }
}))

routes.forEach(({ regex, headers, dest }) => {
  app.get(regex, (req, res) => {
    res.set(headers)
    res.sendFile(path.resolve(exportDir, dest ? req.path.replace(regex, dest) : req.path))
  })
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))

// Handle SIGINT (source: https://git.io/vhJgF)
process.on('SIGINT', () => process.exit(0))
