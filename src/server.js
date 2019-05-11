// This is the Sapper server, which we only run during `sapper export`.

import * as sapper from '../__sapper__/server.js'
import express from 'express'
import { port } from '../config.json'

const { PORT = port } = process.env
const app = express()

app.use(express.static('static'))
app.use(sapper.middleware())

app.listen(PORT, () => console.log(`listening on port ${PORT}`))

// Handle SIGINT (source: https://git.io/vhJgF)
process.on('SIGINT', () => process.exit(0))
