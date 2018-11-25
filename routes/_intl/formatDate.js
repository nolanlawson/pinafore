import timeago from 'timeago.js'
import { mark, stop } from '../_utils/marks'

const timeagoInstance = timeago()

export function formatDate (date) {
  mark('compute relativeDate')
  let res = timeagoInstance.format(date)
  stop('compute relativeDate')
  return res
}
