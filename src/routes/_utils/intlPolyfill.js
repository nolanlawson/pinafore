window.IntlPolyfill = require('intl/lib/core.js')
require('intl/locale-data/jsonp/en-US')
if (!window.Intl) {
  window.Intl = window.IntlPolyfill
  window.IntlPolyfill.__applyLocaleSensitivePrototypes()
}
