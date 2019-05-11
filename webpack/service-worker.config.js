const config = require('sapper/config/webpack.js')
const terser = require('./terser.config')
const webpack = require('webpack')
const { mode, dev, resolve, define } = require('./shared.config')

module.exports = {
  entry: config.serviceworker.entry(),
  output: config.serviceworker.output(),
  resolve,
  mode,
  devtool: dev ? 'inline-source-map' : 'source-map',
  plugins: [
    new webpack.DefinePlugin(Object.assign({
      'process.browser': true,
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.SAPPER_TIMESTAMP': process.env.SAPPER_TIMESTAMP || Date.now()
    }, define)),
    terser()
  ]
}
