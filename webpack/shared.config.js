const mode = process.env.NODE_ENV
const dev = mode === 'development'

const resolve = {
  extensions: ['.js', '.json', '.html'],
  mainFields: ['svelte', 'module', 'browser', 'main'],
  alias: {
    'react': 'preact-compat',
    'react-dom': 'preact-compat'
  }
}

module.exports = {
  mode,
  dev,
  resolve
}
