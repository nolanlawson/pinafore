const config = require('sapper/config/webpack.js')
const webpack = require('webpack')

const isDev = config.dev

module.exports = {
  entry: config.serviceworker.entry(),
  output: config.serviceworker.output(),
  mode: process.env.NODE_ENV,
  devtool: isDev ? 'inline-source-map' : 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.SAPPER_TIMESTAMP': process.env.SAPPER_TIMESTAMP || Date.now()
    })
  ]
}
