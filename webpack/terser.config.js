const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = () => new TerserWebpackPlugin({
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
