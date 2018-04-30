const webpack = require('webpack')
const config = require('sapper/webpack/config.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const isDev = config.dev

module.exports = {
  entry: config.client.entry(),
  output: config.client.output(),
  resolve: {
    extensions: ['.js', '.json', '.html']
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {
          loader: 'svelte-loader',
          options: {
            dev: isDev,
            hydratable: true,
            emitCss: !isDev,
            hotReload: isDev
          }
        }
      },
      isDev && {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      !isDev && {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ].filter(Boolean)
  },
  node: {
    setImmediate: false
  },
  optimization: isDev ? {} : {
    minimizer: [
      new UglifyWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          ecma: 6,
          mangle: true,
          compress: true,
          output: {
            comments: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 5000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity
    }
  },
  plugins: [
    new LodashModuleReplacementPlugin()
  ].concat(isDev ? [
    new webpack.HotModuleReplacementPlugin({
      requestTimeout: 120000
    })
  ] : [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[name].[id].[hash].css'
    }),
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
  devtool: isDev ? 'cheap-module-source-map' : 'source-map'
}
