// adapted from https://unpkg.com/timeago.js@4.0.0-beta.1/lib/index.js
/**
 * Created by hustcc on 18/5/20.
 * Contract: i@hust.cc
 */

var IndexMapEn = 'second_minute_hour_day_week_month_year'.split('_')
var SEC_ARRAY = [60, 60, 24, 7, 365 / 7 / 12, 12]

/**
 * Created by hustcc on 18/5/20.
 * Contract: i@hust.cc
 */

function en (number, index) {
  if (index === 0) {
    return ['just now', 'right now']
  }
  var unit = IndexMapEn[Math.floor(index / 2)]
  if (number > 1) {
    unit += 's'
  }
  return [number + ' ' + unit + ' ago', 'in ' + number + ' ' + unit]
}

/**
 * Created by hustcc on 18/5/20.
 * Contract: i@hust.cc
 */

/**
 * format the diff second to *** time ago, with setting locale
 * @param diff
 * @param locale
 * @param defaultLocale
 * @returns {string | void | *}
 */
function formatDiff (diff) {
  // if locale is not exist, use defaultLocale.
  // if defaultLocale is not exist, use build-in `en`.
  // be sure of no error when locale is not exist.
  var i = 0

  var agoin = diff < 0 ? 1 : 0

  // timein or timeago

  var totalSec = diff = Math.abs(diff)

  for (; diff >= SEC_ARRAY[i] && i < SEC_ARRAY.length; i++) {
    diff /= SEC_ARRAY[i]
  }
  diff = Math.floor(diff)
  i *= 2

  if (diff > (i === 0 ? 9 : 1)) i += 1
  return en(diff, i, totalSec)[agoin].replace('%s', diff)
}

/**
 * calculate the diff second between date to be formatted an now date.
 * @param date
 * @param nowDate
 * @returns {number}
 */
function diffSec (date) {
  var nowDate = new Date()
  var otherDate = new Date(date)
  return (nowDate - otherDate) / 1000
}

/**
 * Created by hustcc on 18/5/20.
 * Contract: i@hust.cc
 */
export function format (date) {
  return formatDiff(diffSec(date))
}
