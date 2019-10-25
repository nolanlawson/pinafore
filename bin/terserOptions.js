module.exports = {
  ecma: 8,
  mangle: true,
  compress: {
    pure_funcs: [
      'console.log', // remove console logs in production
      '__thunk__' // see thunk.js
    ]
  },
  output: {
    comments: false
  },
  safari10: true
}
