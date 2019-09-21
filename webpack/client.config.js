const webpack = require('webpack')
const config = require('sapper/config/webpack.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const terser = require('./terser.config')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const legacyBabel = require('./legacyBabel.config')
const { mode, dev, resolve, inlineSvgs, allSvgs } = require('./shared.config')

const urlRegex = require('../src/routes/_utils/urlRegexSource.js')()

const output = Object.assign(config.client.output(), {
  // enables HMR in workers
  globalObject: 'this',
  // Zeit does not like filenames with "$" in them, so just keep things simple
  filename: '[hash]/[id].js',
  chunkFilename: '[hash]/[id].js'
})

module.exports = {
  entry: config.client.entry(),
  output,
  resolve,
  mode,
  module: {
    rules: [
      {
        test: /\/_workers\/blurhash\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            name: 'blurhash.[hash].[name].[ext]'
          }
        }
      },
      {
        test: [
          /tesseract\.js\/dist\/worker\.min\.js$/,
          /tesseract\.js\/dist\/worker\.min\.js.map$/,
          /tesseract\.js-core\/tesseract-core\.wasm$/,
          /tesseract\.js-core\/tesseract-core\.wasm.js$/
        ],
        use: {
          loader: 'file-loader',
          options: {
            name: 'tesseract-asset.[hash].[name].[ext]'
          }
        }
      },
      {
        test: /\.m?js$/,
        include: /node_modules\/emoji-mart/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [
                'transform-react-remove-prop-types',
                {
                  removeImport: true,
                  additionalLibraries: [
                    '../../utils/shared-props'
                  ]
                }
              ]
            ]
          }
        }
      },
      process.env.LEGACY && legacyBabel(),
      {
        test: /\.html$/,
        use: {
          loader: 'svelte-loader',
          options: {
            dev,
            hydratable: true,
            store: true,
            hotReload: dev
          }
        }
      }
    ].filter(Boolean)
  },
  node: {
    setImmediate: false
  },
  optimization: dev ? {} : {
    minimizer: [
      terser()
    ].filter(Boolean),
    splitChunks: {
      chunks: 'async',
      minSize: 5000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      name: false // these chunk names can be annoyingly long
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.browser': true,
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.INLINE_SVGS': JSON.stringify(inlineSvgs),
      'process.env.ALL_SVGS': JSON.stringify(allSvgs),
      'process.env.URL_REGEX': urlRegex.toString(),
      'process.env.LEGACY': !!process.env.LEGACY
    }),
    new webpack.NormalModuleReplacementPlugin(
      /\/_database\/database\.js$/, // this version plays nicer with IDEs
      './database.prod.js'
    ),
    new LodashModuleReplacementPlugin(),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
      cwd: process.cwd()
    })
  ].concat(dev ? [
    new webpack.HotModuleReplacementPlugin({
      requestTimeout: 120000
    })
  ] : [

    new BundleAnalyzerPlugin({ // generates report.html
      analyzerMode: 'static',
      openAnalyzer: false,
      logLevel: 'silent'
    })
  ]),
  devtool: dev ? 'inline-source-map' : 'source-map',
  performance: {
    hints: dev ? false : (process.env.DEBUG ? 'warning' : 'error'),
    assetFilter: assetFilename => {
      return !(/\.map$/.test(assetFilename)) && !/tesseract-asset/.test(assetFilename)
    }
  }
}
