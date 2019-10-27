module.exports = () => ({
  test: /\.(m?js|html)$/,
  exclude: path => {
    if (!path.includes('node_modules')) {
      return false // don't exclude our own modules
    }
    const toSkip = [
      'tesseract.js',
      'realistic-structured-clone',
      '@babel/runtime',
      'page-lifecycle',
      'localstorage-memory',
      'promise-worker',
      'webpack'
    ]
    for (const module of toSkip) {
      if (path.includes(`node_modules/${module}`)) {
        return true // exclude certain packages that don't transpile well
      }
    }
    return false
  },
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-env'
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            // This started failing with commit 2a248cb for some mysterious reason, causing an error:
            // TypeError: Cannot set property 'wrap' of undefined
            // I could not for the life of me figure out how to fix it, so I just manually import regenerator.
            regenerator: false
          }
        ]
      ]
    }
  }
})
