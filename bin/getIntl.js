import { get } from '../src/routes/_utils/lodash-lite.js'
import { DEFAULT_LOCALE, LOCALE } from '../src/routes/_static/intl.js'

import enUS from '../src/intl/en-US.js'
import fr from '../src/intl/fr.js'
import de from '../src/intl/de.js'

// TODO: make it so we don't have to explicitly list these out
const locales = {
  'en-US': enUS,
  fr,
  de
}

const intl = locales[LOCALE]
const defaultIntl = locales[DEFAULT_LOCALE]

export function warningOrError (message) { // avoid crashing the whole server on `yarn dev`
  if (process.env.NODE_ENV === 'production') {
    throw new Error(message)
  }
  console.warn(message)
  return '(Placeholder intl string)'
}

export function getIntl (path) {
  path = path.split('.')
  const res = get(intl, path, get(defaultIntl, path))
  if (typeof res !== 'string') {
    return warningOrError('Unknown intl string: ' + JSON.stringify(path))
  }
  return res
}

export function trimWhitespace (str) {
  return str.trim().replace(/\s+/g, ' ')
}
