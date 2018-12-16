const config = require('sapper/config/webpack.js')
const terser = require('./terser.config')
const webpack = require('webpack')
const { mode, dev } = require('./shared.config')

module.exports = {
  entry: config.serviceworker.entry(),
  output: config.serviceworker.output(),
  mode,
  devtool: dev ? 'inline-source-map' : 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.browser': true,
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.SAPPER_TIMESTAMP': process.env.SAPPER_TIMESTAMP || Date.now()
    }),
    terser()
  ]
}
