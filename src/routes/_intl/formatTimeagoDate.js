import { format } from '../_thirdparty/timeago/timeago'
import { mark, stop } from '../_utils/marks'

// Format a date in the past
export function formatTimeagoDate (date, now) {
  mark('formatTimeagoDate')
  // use Math.min() to avoid things like "in 10 seconds" when the timestamps are slightly off
  const res = format(Math.min(0, date - now))
  stop('formatTimeagoDate')
  return res
}

// Format a date in the future
export function formatTimeagoFutureDate (date, now) {
  mark('formatTimeagoFutureDate')
  // use Math.max() for same reason as above
  const res = format(Math.max(0, date - now))
  stop('formatTimeagoFutureDate')
  return res
}
