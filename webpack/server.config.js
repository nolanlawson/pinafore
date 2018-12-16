const config = require('sapper/config/webpack.js')
const pkg = require('../package.json')
const { mode, dev } = require('./shared.config')

module.exports = {
  entry: config.server.entry(),
  output: config.server.output(),
  target: 'node',
  resolve: {
    extensions: ['.js', '.json', '.html'],
    mainFields: ['svelte', 'module', 'browser', 'main']
  },
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
  }
}
