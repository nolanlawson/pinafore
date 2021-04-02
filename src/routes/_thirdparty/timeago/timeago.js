// adapted from https://unpkg.com/timeago.js@4.0.0-beta.1/lib/index.js
import { LOCALE } from '../../_static/intl'
import { thunk } from '../../_utils/thunk'

const IndexMapEn = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year']
const SEC_ARRAY = [60, 60, 24, 7, 365 / 7 / 12, 12]
const intlFormat = thunk(() => new Intl.RelativeTimeFormat(LOCALE))

function formatRelativeTime (number, index) {
  if (index === 0) {
    if (process.env.NODE_ENV === 'test') {
      return require('../../../intl/en-US').default.justNow // only used in mocha tests
    }
    return 'intl.justNow'
  }
  const unit = IndexMapEn[Math.floor(index / 2)]

  return intlFormat().format(number, unit)
}

function formatDiff (seconds) {
  let i = 0

  const pastDate = seconds < 0

  // timein or timeago

  seconds = Math.abs(seconds)

  for (; seconds >= SEC_ARRAY[i] && i < SEC_ARRAY.length; i++) {
    seconds /= SEC_ARRAY[i]
  }
  seconds = Math.floor(seconds)
  i *= 2

  if (seconds > (i === 0 ? 9 : 1)) {
    i += 1
  }
  return formatRelativeTime(pastDate ? -seconds : seconds, i)
}

export function format (milliseconds) {
  return formatDiff(milliseconds / 1000)
}
