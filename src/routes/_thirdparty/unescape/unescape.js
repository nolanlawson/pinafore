//
// Originally via https://github.com/jonschlinkert/unescape/blob/98d1e52/index.js
//
import { thunk } from '../../_utils/thunk'

// via https://www.htmlhelp.com/reference/html40/entities/special.html
// plus some more known entities like pound, nbsp, etc
const chars = {
  '&amp;': '&',
  '&apos;': '\'',
  '&bdquo;': '„',
  '&cent;': '¢',
  '&circ;': 'ˆ',
  '&copy;': '©',
  '&dagger;': '†',
  '&Dagger;': '‡',
  '&emsp;': ' ',
  '&ensp;': ' ',
  '&euro;': '€',
  '&gt;': '>',
  '&ldquo;': '“',
  '&lrm;': '',
  '&lsaquo;': '‹',
  '&lsquo;': '‘',
  '&lt;': '<',
  '&mdash;': '—',
  '&nbsp;': ' ',
  '&ndash;': '–',
  '&oelig;': 'œ',
  '&OElig;': 'Œ',
  '&permil;': '‰',
  '&pound;': '£',
  '&quot;': '"',
  '&rdquo;': '”',
  '&reg;': '®',
  '&rsaquo;': '›',
  '&rsquo;': '’',
  '&sbquo;': '‚',
  '&scaron;': 'š',
  '&Scaron;': 'Š',
  '&thinsp;': ' ',
  '&tilde;': '˜',
  '&yen;': '¥',
  '&Yuml;': 'Ÿ'
}

const getRegex = thunk(() => toRegex(chars))

/**
 * Convert HTML entities to HTML characters.
 *
 * @param  {String} `str` String with HTML entities to un-escape.
 * @return {String}
 */
function unescape (str) {
  return str.replace(getRegex(), replace)
}

function replace (match) {
  const knownValue = chars[match]
  if (knownValue) {
    return knownValue
  }
  let codePoint
  try {
    if (match.startsWith('&#x')) { // hex
      codePoint = parseInt(match.substring(3, match.length - 1), 16)
    } else { // decimal
      codePoint = parseInt(match.substring(2, match.length - 1), 10)
    }
    return String.fromCodePoint(codePoint)
  } catch (e) {
    return match // bad code point, bail out
  }
}

function toRegex (chars) {
  const patterns = Object.keys(chars).concat([
    '&#[0-9]{1,6};', // decimal code points
    '&#x[a-fA-F0-9]{1,6};' // hex code points
  ])

  return new RegExp('(' + patterns.join('|') + ')', 'g')
}

/**
 * Expose `unescape`
 */

export { unescape }
