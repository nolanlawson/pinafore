import { emojifyText } from './emojifyText.js'
import { massageStatusPlainText } from './massageStatusPlainText.js'

export function massageUserText (text, emojis, $autoplayGifs) {
  text = text || ''
  text = emojifyText(text, emojis, $autoplayGifs)
  text = massageStatusPlainText(text)
  return text
}
