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
        '@babel/plugin-transform-runtime'
      ]
    }
  }
})
