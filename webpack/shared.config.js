const svgs = require('../bin/svgs')

const inlineSvgs = svgs.filter(_ => _.inline).map(_ => `#${_.id}`)
const mode = process.env.NODE_ENV || 'production'
const dev = mode === 'development'

const resolve = {
  extensions: ['.js', '.json', '.html'],
  mainFields: ['svelte', 'module', 'browser', 'main'],
  alias: {
    'react': 'preact/compat/dist/compat.module.js',
    'react-dom': 'preact/compat/dist/compat.module.js'
  }
}

module.exports = {
  mode,
  dev,
  resolve,
  inlineSvgs
}
