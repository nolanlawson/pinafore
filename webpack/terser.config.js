const TerserWebpackPlugin = require('terser-webpack-plugin')
const terserOptions = require('../bin/terserOptions')

module.exports = () => new TerserWebpackPlugin({
  exclude: /(tesseract-asset|page-lifecycle)/, // tesseract causes problems, page-lifecycle is pre-minified
  parallel: true,
  terserOptions
})
