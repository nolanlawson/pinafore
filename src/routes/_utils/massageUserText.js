import { emojifyText } from './emojifyText'

export function massageUserText (text, emojis, $autoplayGifs) {
  text = text || ''
  text = emojifyText(text, emojis, $autoplayGifs)

  // GNU Social and Pleroma don't add <p> tags
  if (text && !text.startsWith('<p>')) {
    text = `<p>${text}</p>`
  }
  return text
}
