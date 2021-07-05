#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import express from 'express'
import compression from 'compression'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

// JSON files not supported in ESM yet
// https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#how-can-i-import-json
const vercelJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'vercel.json'), 'utf8'))

const { routes: rawRoutes } = vercelJson

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
