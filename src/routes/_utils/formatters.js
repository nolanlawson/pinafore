import { LOCALE } from '../_static/intl.js'
import { thunk } from './thunk.js'

const safeFormatter = (formatter) => {
  return {
    format (date) {
      if (typeof date !== 'number') {
        return 'intl.never' // null means "never" in Misskey
      }
      try {
        return formatter.format(date)
      } catch (e) {
        if (e instanceof RangeError) {
          // The fediverse is wild, so invalid dates may exist. Don't fail with a fatal error in that case.
          // https://github.com/nolanlawson/pinafore/issues/2113
          return 'intl.never'
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
