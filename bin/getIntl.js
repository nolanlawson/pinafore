import { get } from 'lodash-es'
import { DEFAULT_LOCALE, LOCALE } from '../src/routes/_static/intl'
import path from 'path'

const intl = require(path.join(__dirname, '../src/intl', LOCALE + '.js')).default
const defaultIntl = require(path.join(__dirname, '../src/intl', DEFAULT_LOCALE + '.js')).default

export function warningOrError (message) { // avoid crashing the whole server on `yarn dev`
  if (process.env.NODE_ENV === 'production') {
    throw new Error(message)
  }
  console.warn(message)
  return '(Placeholder intl string)'
}

export function getIntl (path) {
  const res = get(intl, path, get(defaultIntl, path))
  if (typeof res !== 'string') {
    return warningOrError('Unknown intl string: ' + JSON.stringify(path))
  }
  return res
}

export function trimWhitespace (str) {
  return str.trim().replace(/\s+/g, ' ')
}
