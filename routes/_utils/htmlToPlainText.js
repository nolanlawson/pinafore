import { mark, stop } from './marks'
import htmlToFormattedText from 'html-to-formatted-text'
import { decode } from '../_thirdparty/he/he'

export function htmlToPlainText (html) {
  if (!html) {
    return ''
  }
  mark('htmlToPlainText')
  let res = decode(htmlToFormattedText(html))
  stop('htmlToPlainText')
  return res
}
