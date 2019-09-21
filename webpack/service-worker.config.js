const config = require('sapper/config/webpack.js')
const terser = require('./terser.config')
const webpack = require('webpack')
const { mode, dev, resolve } = require('./shared.config')
const legacyBabel = require('./legacyBabel.config')

module.exports = {
  entry: config.serviceworker.entry(),
  output: config.serviceworker.output(),
  resolve,
  mode,
  devtool: dev ? 'inline-source-map' : 'source-map',
  module: {
    rules: [
      process.env.LEGACY && legacyBabel()
    ].filter(Boolean)
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.browser': true,
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.LEGACY': !!process.env.LEGACY,
      'process.env.SAPPER_TIMESTAMP': process.env.SAPPER_TIMESTAMP || Date.now()
    }),
    terser()
  ].filter(Boolean)
}
