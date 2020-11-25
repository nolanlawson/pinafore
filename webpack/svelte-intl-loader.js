// Inject intl statements into a Svelte v2 HTML file
// We do this for perf reasons, to make the output smaller and avoid needing to have a huge JSON file of translations
import intl from '../src/intl/en-US'
import { get as lodashGet } from 'lodash-es'
import parse from 'format-message-parse'

function get (obj, path) {
  const res = lodashGet(obj, path)
  if (!res) {
    throw new Error('Unknown intl string: ' + JSON.stringify(path))
  }
  return res
}

function trimWhitespace (str) {
  return str.trim().replace(/\s+/g, ' ')
}

export default function (source) {
  return source
    // replace {@intl.foo}
    .replace(/{intl\.([^}]+)}/g, (match, p1) => trimWhitespace(get(intl, p1)))
    // replace {@html intl.foo}
    .replace(/{@html intl\.([^}]+)}/g, (match, p1) => {
      const html = trimWhitespace(get(intl, p1))
      return `{@html ${JSON.stringify(html)}}`
    })
    // replace 'intl.foo', which should only be used in JS for plurals/complex strings
    .replace(/'intl\.([^']+)'/, (match, p1) => {
      const text = trimWhitespace(get(intl, p1))
      const ast = parse(text)
      console.log('ast', ast)
      return JSON.stringify(ast)
    })
}
