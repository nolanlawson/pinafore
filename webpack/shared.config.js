const mode = process.env.NODE_ENV
const dev = mode === 'development'

const resolve = {
  extensions: ['.js', '.json', '.html'],
  mainFields: ['svelte', 'module', 'browser', 'main'],
  alias: {
    'react': 'react-lite',
    'react-dom': 'react-lite'
  }
}

module.exports = {
  mode,
  dev,
  resolve
}
