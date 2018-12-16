const config = require('sapper/config/webpack.js')
const terser = require('./terser.config')
const webpack = require('webpack')

const isDev = config.dev

module.exports = {
  entry: config.serviceworker.entry(),
  output: config.serviceworker.output(),
  mode: process.env.NODE_ENV,
  devtool: isDev ? 'inline-source-map' : 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.browser': true,
      'process.env.NODE_ENV': '"production"',
      'process.env.SAPPER_TIMESTAMP': process.env.SAPPER_TIMESTAMP || Date.now()
    }),
    terser()
  ]
}
