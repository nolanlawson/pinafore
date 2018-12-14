import { format } from '../_thirdparty/timeago/timeago.js'
import { mark, stop } from '../_utils/marks.js'

export function formatTimeagoDate (date) {
  mark('formatTimeagoDate')
  let res = format(date)
  stop('formatTimeagoDate')
  return res
}
