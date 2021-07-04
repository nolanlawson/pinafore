import TerserWebpackPlugin from 'terser-webpack-plugin'
import terserOptions from '../bin/terserOptions'

export default () => new TerserWebpackPlugin({
  exclude: /(tesseract-asset|page-lifecycle)/, // tesseract causes problems, page-lifecycle is pre-minified
  parallel: true,
  terserOptions
})
