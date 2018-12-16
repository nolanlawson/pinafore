const webpack = require('webpack')
const config = require('sapper/config/webpack.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  entry: config.client.entry(),
  output: Object.assign(config.client.output(), { globalObject: 'this' }), // enables HMR in workers
  resolve: {
    extensions: ['.js', '.json', '.html'],
    mainFields: ['svelte', 'module', 'browser', 'main']
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'svelte-loader',
          options: {
            dev: isDev,
            hydratable: true,
            store: true,
            hotReload: isDev
          }
        }
      }
    ].filter(Boolean)
  },
  node: {
    setImmediate: false
  },
  optimization: isDev ? {} : {
    minimizer: [
      new TerserWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          ecma: 6,
          mangle: true,
          compress: {
            pure_funcs: ['console.log']
          },
          output: {
            comments: false
          },
          safari10: true
        }
      })
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 5000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity
    }
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      /\/_database\/database\.js$/, // this version plays nicer with IDEs
      './database.prod.js'
    ),
    new LodashModuleReplacementPlugin({
      paths: true
    })
  ].concat(isDev ? [
    new webpack.HotModuleReplacementPlugin({
      requestTimeout: 120000
    })
  ] : [
    new webpack.DefinePlugin({
      'process.browser': true,
      'process.env.NODE_ENV': '"production"'
    }),
    new BundleAnalyzerPlugin({ // generates report.html and stats.json
      analyzerMode: 'static',
      generateStatsFile: true,
      statsOptions: {
        // allows usage with http://chrisbateman.github.io/webpack-visualizer/
        chunkModules: true
      },
      openAnalyzer: false,
      logLevel: 'silent' // do not bother Webpacker, who runs with --json and parses stdout
    })
  ]),
  devtool: isDev ? 'inline-source-map' : 'source-map'
}
