// Glitch Social can have statuses that just contain blockquote/ol/ul, no p
const STARTING_TAG_REGEX = /^<(?:p|blockquote|ol|ul)>/i

export function massageStatusPlainText (text) {
  // GNU Social and Pleroma don't add <p> tags, so wrap them
  if (text && !STARTING_TAG_REGEX.test(text)) {
    text = `<p>${text}</p>`
  }
  return text
}
