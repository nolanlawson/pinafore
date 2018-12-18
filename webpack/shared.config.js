const mode = process.env.NODE_ENV
const dev = mode === 'development'

const resolve = {
  extensions: ['.js', '.json', '.html'],
  mainFields: ['svelte', 'module', 'browser', 'main'],
  alias: {
    'react': 'inferno-compat',
    'react-dom': 'inferno-compat'
  }
}

module.exports = {
  mode,
  dev,
  resolve
}
