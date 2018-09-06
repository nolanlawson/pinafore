const config = require('sapper/config/webpack.js')

const isDev = config.dev

module.exports = {
  entry: config.serviceworker.entry(),
  output: config.serviceworker.output(),
  mode: process.env.NODE_ENV,
  devtool: isDev ? 'cheap-module-source-map' : 'source-map'
}
