const webpack = require('webpack')
const config = require('sapper/webpack/config.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const isDev = config.dev

module.exports = {
  entry: config.client.entry(),
  output: config.client.output(),
  resolve: {
    extensions: ['.js', '.html']
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
            hydratable: true,
            emitCss: !isDev,
            cascade: false,
            store: true
          }
        }
      },
      isDev && {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      !isDev && {
        test: /\.css$/,
        /* disable while https://github.com/sveltejs/sapper/issues/79 is open */
        /* use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{ loader: 'css-loader', options: { sourceMap:isDev } }]
        }) */
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      }
    ].filter(Boolean)
  },
  node: {
    setImmediate: false
  },
  plugins: isDev ? [
    new webpack.HotModuleReplacementPlugin()
  ] : [
    new webpack.DefinePlugin({
      'process.browser': true,
      'process.env.NODE_ENV': '"production"'
    }),
    /* disable while https://github.com/sveltejs/sapper/issues/79 is open */
    // new ExtractTextPlugin('main.css'),
    new LodashModuleReplacementPlugin(),
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
  ],
  devtool: isDev ? 'cheap-module-source-map' : 'source-map'
}
