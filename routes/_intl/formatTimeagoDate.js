import { format } from '../_thirdparty/timeago/timeago'
import { mark, stop } from '../_utils/marks'

export function formatTimeagoDate (date) {
  mark('formatTimeagoDate')
  let res = format(date)
  stop('formatTimeagoDate')
  return res
}
