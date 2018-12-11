const client = require('./webpack/client.config')
const server = require('./webpack/server.config')
const serviceworker = require('./webpack/service-worker.config')

module.exports = {
  client,
  server,
  serviceworker
}
