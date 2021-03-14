import { LOCALE } from '../src/routes/_static/intl'
import path from 'path'

const config = require('sapper/config/webpack.js')
const terser = require('./terser.config')
const webpack = require('webpack')
const { mode, dev, resolve } = require('./shared.config')

module.exports = {
  entry: config.serviceworker.entry(),
  output: config.serviceworker.output(),
  resolve,
  mode,
  devtool: dev ? 'inline-source-map' : 'source-map',
  optimization: dev
    ? {}
    : {
        minimize: !process.env.DEBUG,
        minimizer: [
          terser()
        ]
      },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: path.join(__dirname, './svelte-intl-loader.js')
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.browser': true,
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.SAPPER_TIMESTAMP': process.env.SAPPER_TIMESTAMP || Date.now(),
      'process.env.LOCALE': JSON.stringify(LOCALE),
      'process.env.IS_SERVICE_WORKER': 'true'
    })
  ].filter(Boolean)
}
