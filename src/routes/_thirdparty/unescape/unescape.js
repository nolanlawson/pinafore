// via https://github.com/jonschlinkert/unescape/blob/98d1e52/index.js

const chars = {
  '&quot;': '"',
  '&#34;': '"',

  '&apos;': '\'',
  '&#39;': '\'',

  '&amp;': '&',
  '&#38;': '&',

  '&gt;': '>',
  '&#62;': '>',

  '&lt;': '<',
  '&#60;': '<',

  '&cent;': '¢',
  '&#162;': '¢',

  '&copy;': '©',
  '&#169;': '©',

  '&euro;': '€',
  '&#8364;': '€',

  '&pound;': '£',
  '&#163;': '£',

  '&reg;': '®',
  '&#174;': '®',

  '&yen;': '¥',
  '&#165;': '¥',

  '&nbsp;': ' '
}

let regex

/**
 * Convert HTML entities to HTML characters.
 *
 * @param  {String} `str` String with HTML entities to un-escape.
 * @return {String}
 */

function unescape (str) {
  regex = regex || toRegex(chars)
  return str.replace(regex, m => chars[m])
}

function toRegex (chars) {
  var keys = Object.keys(chars).join('|')
  return new RegExp('(' + keys + ')', 'g')
}

/**
 * Expose `unescape`
 */

export { unescape }
