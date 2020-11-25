// Inject intl statements into a Svelte v2 HTML file
// We do this for perf reasons, to make the output smaller and avoid needing to have a huge JSON file of translations
const intl = require('../src/intl/en-US')

// basically the same as lodash.get
function get (obj, keys, defaultValue) {
  if (typeof keys === 'string') {
    keys = keys.split('.')
  }
  for (const key of keys) {
    if (obj && key in obj) {
      obj = obj[key]
    } else {
      return defaultValue
    }
  }
  return obj
}

module.exports = function (source) {
  return source
    // replace {@intl.foo}
    .replace(/{intl.([^}]+)}/g, (match, p1) => get(intl, p1))
    // replace {@html intl.foo}
    .replace(/{@html intl.([^}]+)}/g, (match, p1) => {
      const html = get(intl, p1).replace(/\s+/g, ' ') // minify HTML by removing spaces
      return `{@html ${JSON.stringify(html)}}`
    })
}
