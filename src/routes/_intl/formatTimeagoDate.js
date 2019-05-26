import { format } from '../_thirdparty/timeago/timeago'
import { mark, stop } from '../_utils/marks'

export function formatTimeagoDate (date, now) {
  mark('formatTimeagoDate')
  // use Math.max() to avoid things like "in 10 seconds" when the timestamps are slightly off
  let res = format(date, Math.max(now, date))
  stop('formatTimeagoDate')
  return res
}
