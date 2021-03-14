import { LOCALE } from '../src/routes/_static/intl'

const path = require('path')
const webpack = require('webpack')
const config = require('sapper/config/webpack.js')
const pkg = require('../package.json')
const { mode, dev, resolve, inlineSvgs, allSvgs } = require('./shared.config')
const { version } = require('../package.json')

// modules that the server should ignore, either because they cause errors or warnings
// (because they're only used on the client side)
const NOOP_MODULES = [
  '../_workers/blurhash',
  'tesseract.js/dist/worker.min.js',
  'tesseract.js/dist/worker.min.js.map',
  'tesseract.js-core/tesseract-core.wasm',
  'tesseract.js-core/tesseract-core.wasm.js',
  'tesseract.js/src/createWorker.js',
  'tesseract.js/src/createWorker.js.map'
]

const serverResolve = JSON.parse(JSON.stringify(resolve))
serverResolve.alias = serverResolve.alias || {}
NOOP_MODULES.forEach(mod => {
  serverResolve.alias[mod] = 'lodash-es/noop'
})

module.exports = {
  entry: config.server.entry(),
  output: config.server.output(),
  target: 'node',
  resolve: serverResolve,
  externals: Object.keys(pkg.dependencies),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: path.join(__dirname, './svelte-intl-loader.js')
        }
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            css: false,
            store: true,
            generate: 'ssr',
            dev
          }
        }
      },
      {
        loader: path.join(__dirname, './svelte-intl-loader.js')
      }
    ]
  },
  mode,
  performance: {
    hints: false // it doesn't matter if server.js is large
  },
  optimization: dev ? {} : { minimize: false },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.INLINE_SVGS': JSON.stringify(inlineSvgs),
      'process.env.ALL_SVGS': JSON.stringify(allSvgs),
      'process.env.LOCALE': JSON.stringify(LOCALE),
      'process.env.PINAFORE_VERSION': JSON.stringify(version),
      'process.env.IS_SERVICE_WORKER': 'false'
    })
  ]
}
