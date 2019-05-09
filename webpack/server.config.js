const webpack = require('webpack')
const config = require('sapper/config/webpack.js')
const pkg = require('../package.json')
const { mode, dev, resolve, inlineSvgs } = require('./shared.config')

const serverResolve = JSON.parse(JSON.stringify(resolve))
serverResolve.alias['page-lifecycle/dist/lifecycle.mjs'] = 'lodash-es/noop' // page lifecycle fails in Node

module.exports = {
  entry: config.server.entry(),
  output: config.server.output(),
  target: 'node',
  resolve: serverResolve,
  externals: Object.keys(pkg.dependencies),
  module: {
    rules: [
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
      }
    ]
  },
  mode,
  performance: {
    hints: false // it doesn't matter if server.js is large
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.INLINE_SVGS': JSON.stringify(inlineSvgs)
    })
  ]
}
