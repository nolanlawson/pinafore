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
  let res = ''
  let paragraphs = doc.querySelectorAll('p')
  for (let i = 0; i < paragraphs.length; i++) {
    let paragraph = paragraphs[i]
    let brs = paragraph.querySelectorAll('br')
    for (let j = 0; j < brs.length; j++) {
      let br = brs[j]
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
  // GNU Social and Pleroma don't add <p> tags
  if (!html.startsWith('<p>')) {
    html = `<p>${html}</p>`
  }
  let doc = domParser.parseFromString(html, 'text/html')
  massageMentions(doc, mentions)
  let res = innerTextRetainingNewlines(doc)
  stop('statusHtmlToPlainText')
  return res
}
