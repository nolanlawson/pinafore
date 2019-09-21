const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = () => !process.env.DEBUG && new TerserWebpackPlugin({
  exclude: /tesseract-asset/,
  cache: true,
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
