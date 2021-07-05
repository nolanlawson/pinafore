import svgs from '../bin/svgs.js'

const inlineSvgs = svgs.filter(_ => _.inline).map(_ => `#${_.id}`)
const mode = process.env.NODE_ENV || 'production'
const dev = mode === 'development'

const resolve = {
  extensions: ['.js', '.json', '.html'],
  mainFields: ['svelte', 'module', 'browser', 'main'],
  alias: {
    // All browsers we target support Intl.PluralRules (or it's polyfilled).
    // So format-message-interpret can fall back to that. This file is pretty big (9.83kB) and it's not needed.
    './plurals': '@stdlib/utils-noop',
    'lookup-closest-locale': '@stdlib/utils-noop', // small, but also not needed
    'svelte/store.umd.js': 'svelte/store.js' // have to use UMD for Mocha, but in Webpack we can use the ESM version
  }
}

export {
  mode,
  dev,
  resolve,
  inlineSvgs
}
