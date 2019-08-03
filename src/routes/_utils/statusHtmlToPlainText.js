import { mark, stop } from './marks'
import { massageStatusPlainText } from './massageStatusPlainText'

const domParser = process.browser && new DOMParser()

// mentions like "@foo" have to be expanded to "@foo@example.com"
function massageMentions (doc, mentions) {
  const anchors = doc.querySelectorAll('a.mention')
  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i]
    const href = anchor.getAttribute('href')
    const mention = mentions.find(mention => mention.url === href)
    if (mention) {
      anchor.innerText = `@${mention.acct}`
    }
  }
}

// paragraphs should be separated by double newlines
// single <br/>s should become single newlines
function innerTextRetainingNewlines (doc) {
  let res = ''
  const paragraphs = doc.querySelectorAll('p')
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i]
    const brs = paragraph.querySelectorAll('br')
    for (let j = 0; j < brs.length; j++) {
      const br = brs[j]
      br.parentNode.replaceChild(doc.createTextNode('\n'), br)
    }
    res += (i > 0 ? '\n\n' : '') + paragraph.textContent
  }
  return res
}

export function statusHtmlToPlainText (html, mentions) {
  if (!html) {
    return ''
  }
  mark('statusHtmlToPlainText')
  html = massageStatusPlainText(html)
  const doc = domParser.parseFromString(html, 'text/html')
  massageMentions(doc, mentions)
  const res = innerTextRetainingNewlines(doc)
  stop('statusHtmlToPlainText')
  return res
}
