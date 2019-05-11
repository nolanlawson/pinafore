const svgs = require('../bin/svgs')
const configJson = require('../src/config/config.sanitized.js')
const urlRegex = require('../src/routes/_utils/urlRegexSource.js')()

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

const define = {
  'process.env.CONFIG_JSON': JSON.stringify(configJson),
  'process.env.INLINE_SVGS': JSON.stringify(inlineSvgs),
  'process.env.URL_REGEX': urlRegex.toString(),
  'process.env.IS_WEBPACK': true
}

module.exports = {
  mode,
  dev,
  resolve,
  define
}
