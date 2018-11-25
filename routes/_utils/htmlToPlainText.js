import { mark, stop } from './marks'

let domParser = process.browser && new DOMParser()

export function htmlToPlainText (html) {
  if (!html) {
    return ''
  }
  mark('htmlToPlainText')
  let res = domParser.parseFromString(html, 'text/html').documentElement.textContent
  stop('htmlToPlainText')
  return res
}
