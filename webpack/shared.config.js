const svgs = require('../bin/svgs')

const inlineSvgs = svgs.filter(_ => _.inline).map(_ => `#${_.id}`)
const mode = process.env.NODE_ENV || 'production'
const dev = mode === 'development'

const resolve = {
  extensions: ['.js', '.json', '.html'],
  mainFields: ['svelte', 'module', 'browser', 'main'],
  alias: {
    // All browsers we target support Intl.PluralRules (or it's polyfilled).
    // So format-message-interpret can fall back to that. This file is pretty big (9.83kB) and it's not needed.
    './plurals': 'lodash-es/noop',
    'lookup-closest-locale': 'lodash-es/noop' // small, but also not needed
  }
}

module.exports = {
  mode,
  dev,
  resolve,
  inlineSvgs
}
