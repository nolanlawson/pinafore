import { LOCALE } from '../src/routes/_static/intl.js'
import path from 'path'
import webpack from 'webpack'
import config from 'sapper/config/webpack.js'
import pkg from '../package.json'
import { mode, dev, resolve, inlineSvgs } from './shared.config.js'

const { version } = pkg

// modules that the server should ignore, either because they cause errors or warnings
// (because they're only used on the client side)
const NOOP_MODULES = [
  '../_workers/blurhash.js',
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
  serverResolve.alias[mod] = '@stdlib/utils-noop'
})

export default {
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
          loader: path.join(__dirname, './svelte-intl-loader.cjs')
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
        loader: path.join(__dirname, './svelte-intl-loader.cjs')
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
      'process.env.LOCALE': JSON.stringify(LOCALE),
      'process.env.PINAFORE_VERSION': JSON.stringify(version),
      'process.env.IS_SERVICE_WORKER': 'false'
    })
  ]
}
