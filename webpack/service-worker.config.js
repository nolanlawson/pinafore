import { LOCALE } from '../src/routes/_static/intl'
import path from 'path'

import config from 'sapper/config/webpack.js'
import terser from './terser.config'
import webpack from 'webpack'
import { mode, dev, resolve } from './shared.config'

export default {
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
          loader: path.join(__dirname, './svelte-intl-loader.cjs')
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
