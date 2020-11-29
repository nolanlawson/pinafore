// Inject intl statements into a Svelte v2 HTML file as well as some JS files like timeago.js
// We do this for perf reasons, to make the output smaller and avoid needing to have a huge JSON file of translations
import { get } from 'lodash-es'
import parse from 'format-message-parse'
import { DEFAULT_LOCALE, LOCALE } from '../src/routes/_static/intl'
import path from 'path'

const intl = require(path.join(__dirname, '../src/intl', LOCALE + '.js')).default
const defaultIntl = require(path.join(__dirname, '../src/intl', DEFAULT_LOCALE + '.js')).default

function getIntl (path) {
  const res = get(intl, path, get(defaultIntl, path))
  if (typeof res !== 'string') {
    throw new Error('Unknown intl string: ' + JSON.stringify(path))
  }
  return res
}

function trimWhitespace (str) {
  return str.trim().replace(/\s+/g, ' ')
}

export default function (source) {
  const res = source
    // replace {@intl.foo}
    .replace(/{intl\.([^}]+)}/g, (match, p1) => trimWhitespace(getIntl(p1)))
    // replace {@html intl.foo}
    .replace(/{@html intl\.([^}]+)}/g, (match, p1) => {
      const html = trimWhitespace(getIntl(p1))
      return `{@html ${JSON.stringify(html)}}`
    })
    // replace formatIntl('intl.foo' which requires the full AST object
    .replace(/formatIntl\('intl\.([^']+)'/g, (match, p1) => {
      const text = trimWhitespace(getIntl(p1))
      const ast = parse(text)
      return `formatIntl(${JSON.stringify(ast)}`
    })
    // replace 'intl.foo', which doesn't require the AST, just the string
    .replace(/'intl\.([^']+)'/g, (match, p1) => {
      const text = trimWhitespace(getIntl(p1))
      return JSON.stringify(text)
    })
  const match = res.match(/[^(][^']intl\.([\w.]+)/) || res.match(/formatIntl\('([\w.]+)/)
  if (match) {
    throw new Error('You probably made a typo with an intl string: ' + match[1])
  }
  return res
}
