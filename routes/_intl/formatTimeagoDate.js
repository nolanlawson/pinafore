import timeago from 'timeago.js'
import { mark, stop } from '../_utils/marks'

const timeagoInstance = timeago()

export function formatTimeagoDate (date) {
  mark('formatTimeagoDate')
  let res = timeagoInstance.format(date)
  stop('formatTimeagoDate')
  return res
}
