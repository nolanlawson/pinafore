import { DEFAULT_LOCALE, LOCALE } from '../src/routes/_static/intl.js'
import path from 'path'
import webpack from 'webpack'
import config from 'sapper/config/webpack.js'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import terser from './terser.config.js'
import CircularDependencyPlugin from 'circular-dependency-plugin'
import { mode, dev, resolve, inlineSvgs } from './shared.config.js'
import { version } from '../package.json'

import urlRegex from '../src/routes/_utils/urlRegexSource.js'
// TODO: make it so we don't have to list these out explicitly
import fr from 'emoji-picker-element/i18n/fr.js'
import de from 'emoji-picker-element/i18n/de.js'

const emojiPickerLocales = { fr, de }

const emojiPickerI18n = LOCALE !== DEFAULT_LOCALE && emojiPickerLocales[LOCALE]

const output = Object.assign(config.client.output(), {
  // enables HMR in workers
  globalObject: 'this',
  filename: dev ? '[fullhash]/[id].js' : '[id].[contenthash].[name].js',
  chunkFilename: dev ? '[fullhash]/[id].js' : '[id].[contenthash].[name].js'
})

process.on('unhandledRejection', err => {
  // TODO: seems to be a Webpack Bundle Analyzer error we can safely ignore
  if (!err.message.includes('Error: No such label \'done hook\' for WebpackLogger.timeEnd()')) {
    console.error(err)
  }
})

export default {
  entry: config.client.entry(),
  output,
  resolve,
  mode,
  module: {
    rules: [
      {
        test: input => {
          return input.endsWith(path.join('_workers', 'blurhash.js'))
        },
        use: {
          loader: 'worker-loader',
          options: {
            filename: dev ? '[fullhash]/blurhash.[name].js' : 'blurhash.[contenthash].[name].js'
          }
        }
      },
      {
        test: input => {
          return (
            input.endsWith(path.join('tesseract.js', 'dist', 'worker.min.js')) ||
            input.endsWith(path.join('tesseract.js', 'dist', 'worker.min.js.map')) ||
            input.endsWith(path.join('tesseract.js-core', 'tesseract-core.wasm')) ||
            input.endsWith(path.join('tesseract.js-core', 'tesseract-core.wasm.js'))
          )
        },
        use: {
          loader: 'file-loader',
          options: {
            name: dev ? 'tesseract-asset.[name].[ext]' : 'tesseract-asset.[contenthash].[name].[ext]'
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: path.join(__dirname, './svelte-intl-loader.cjs')
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'svelte-loader',
            options: {
              dev,
              hydratable: true,
              store: true,
              hotReload: dev
            }
          },
          {
            loader: path.join(__dirname, './svelte-intl-loader.cjs')
          }
        ]
      }
    ].filter(Boolean)
  },
  optimization: dev
    ? {}
    : {
        minimize: !process.env.DEBUG,
        minimizer: [
          terser()
        ],
        // TODO: we should be able to enable this, but Sapper breaks if we do so
        // // isolate runtime chunk to avoid excessive cache invalidations https://webpack.js.org/guides/caching/
        // runtimeChunk: 'single',
        splitChunks: {
          chunks: 'async',
          minSize: 5000,
          maxAsyncRequests: Infinity,
          maxInitialRequests: Infinity
        }
      },
  plugins: [
    new webpack.DefinePlugin({
      'process.browser': true,
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.INLINE_SVGS': JSON.stringify(inlineSvgs),
      'process.env.URL_REGEX': urlRegex().toString(),
      'process.env.LOCALE': JSON.stringify(LOCALE),
      'process.env.EMOJI_PICKER_I18N': emojiPickerI18n ? JSON.stringify(emojiPickerI18n) : 'undefined',
      'process.env.PINAFORE_VERSION': JSON.stringify(version),
      'process.env.IS_SERVICE_WORKER': 'false'
    }),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
      cwd: process.cwd()
    }),
    dev && new webpack.HotModuleReplacementPlugin({
      requestTimeout: 120000
    }),
    // generates report.html, somewhat expensive to compute, so avoid in CI tests
    !dev && !process.env.CI && new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      logLevel: 'silent'
    })
  ].filter(Boolean),
  devtool: dev ? 'inline-source-map' : 'source-map',
  performance: {
    hints: dev ? false : (process.env.DEBUG ? 'warning' : 'error'),
    assetFilter: assetFilename => {
      return !(/\.map$/.test(assetFilename)) && !/tesseract-asset/.test(assetFilename)
    }
  }
}
