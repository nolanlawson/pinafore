import { format } from '../_thirdparty/timeago/timeago'
import { mark, stop } from '../_utils/marks'

// Format a date in the past
export function formatTimeagoDate (date, now) {
  mark('formatTimeagoDate')
  // use Math.max() to avoid things like "in 10 seconds" when the timestamps are slightly off
  const res = format(date, Math.max(now, date))
  stop('formatTimeagoDate')
  return res
}

// Format a date in the future
export function formatTimeagoFutureDate (date, now) {
  mark('formatTimeagoFutureDate')
  // use Math.min() for same reason as above
  const res = format(date, Math.min(now, date))
  stop('formatTimeagoFutureDate')
  return res
}
