import { mark, stop } from './marks'

let domParser = process.browser && new DOMParser()

// mentions like "@foo" have to be expanded to "@foo@example.com"
function massageMentions (doc, mentions) {
  let anchors = doc.querySelectorAll('a.mention')
  for (let i = 0; i < anchors.length; i++) {
    let anchor = anchors[i]
    let href = anchor.getAttribute('href')
    let mention = mentions.find(mention => mention.url === href)
    if (mention) {
      anchor.innerText = `@${mention.acct}`
    }
  }
}

// paragraphs should be separated by double newlines
// single <br/>s should become single newlines
function innerTextRetainingNewlines (doc) {
  let paragraphs = doc.querySelectorAll('p')
  return Array.from(paragraphs).map(paragraph => {
    let brs = paragraph.querySelectorAll('br')
    Array.from(brs).forEach(br => {
      br.parentNode.replaceChild(doc.createTextNode('\n'), br)
    })
    return paragraph.textContent
  }).join('\n\n')
}

export function statusHtmlToPlainText (html, mentions) {
  if (!html) {
    return ''
  }
  mark('statusHtmlToPlainText')
  let doc = domParser.parseFromString(html, 'text/html')
  massageMentions(doc, mentions)
  let res = innerTextRetainingNewlines(doc)
  stop('statusHtmlToPlainText')
  return res
}
