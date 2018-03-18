const webpack = require('webpack')
const config = require('sapper/webpack/config.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const mode = process.env.NODE_ENV
const isDev = mode === 'development'

module.exports = {
  entry: config.client.entry(),
  output: config.client.output(),
  resolve: {
    extensions: ['.js', '.json', '.html']
  },
  mode,
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            hydratable: true,
            cascade: false,
            store: true,
            hotReload: true
          }
        }
      }
    ]
  },
  node: {
    setImmediate: false
  },
  plugins: [
    isDev && new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.browser': true,
      'process.env.NODE_ENV': JSON.stringify(mode)
    }),
    new LodashModuleReplacementPlugin({
      collections: true,
      caching: true
    }),
    !isDev && new BundleAnalyzerPlugin({ // generates report.html and stats.json
      analyzerMode: 'static',
      generateStatsFile: true,
      statsOptions: {
        // allows usage with http://chrisbateman.github.io/webpack-visualizer/
        chunkModules: true
      },
      openAnalyzer: false,
      logLevel: 'silent' // do not bother Webpacker, who runs with --json and parses stdout
    })
  ].filter(Boolean),
  devtool: isDev ? 'inline-source-map' : 'source-map'
}
