import { LOCALE } from '../_static/intl.js'
import { thunk } from './thunk.js'

const safeFormatter = (formatter) => {
  // The fediverse is wild, so invalid dates may exist. Don't fail with a fatal error in that case.
  // https://github.com/nolanlawson/pinafore/issues/2113
  return {
    format (str) {
      try {
        return formatter.format(str)
      } catch (e) {
        if (e instanceof RangeError) {
          return 'N/A'
        }
        throw e
      }
    }
  }
}

export const absoluteDateFormatter = thunk(() => safeFormatter(new Intl.DateTimeFormat(LOCALE, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})))

export const shortAbsoluteDateFormatter = thunk(() => safeFormatter(new Intl.DateTimeFormat(LOCALE, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})))

export const dayOnlyAbsoluteDateFormatter = thunk(() => safeFormatter(new Intl.DateTimeFormat(LOCALE, {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
})))
