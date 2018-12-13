import { mark, stop } from './marks'

let domParser = process.browser && new DOMParser()

export function statusHtmlToPlainText (html, mentions) {
  if (!html) {
    return ''
  }
  mark('statusHtmlToPlainText')
  let doc = domParser.parseFromString(html, 'text/html')
  // mentions like "@foo" have to be expanded to "@foo@example.com"
  let anchors = doc.querySelectorAll('a.mention')
  for (let i = 0; i < anchors.length; i++) {
    let anchor = anchors[i]
    let href = anchor.getAttribute('href')
    let mention = mentions.find(mention => mention.url === href)
    if (mention) {
      anchor.innerText = `@${mention.acct}`
    }
  }
  let res = doc.documentElement.textContent
  stop('statusHtmlToPlainText')
  return res
}
