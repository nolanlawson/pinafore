const config = require('sapper/webpack/config.js')

const mode = process.env.NODE_ENV
const isDev = mode === 'development'

module.exports = {
  entry: config.serviceworker.entry(),
  output: config.serviceworker.output(),
  mode: process.env.NODE_ENV,
  devtool: isDev ? 'inline-source-map' : 'source-map'
}
