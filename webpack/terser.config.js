const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = () => new TerserWebpackPlugin({
  exclude: /(tesseract-asset|page-lifecycle)/, // tesseract causes problems, page-lifecycle is pre-minified
  cache: !process.env.TERSER_DISABLE_CACHE,
  parallel: true,
  sourceMap: true,
  terserOptions: {
    ecma: 8,
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
