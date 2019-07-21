import { emojifyText } from './emojifyText'
import { massageStatusPlainText } from './massageStatusPlainText'

export function massageUserText (text, emojis, $autoplayGifs) {
  text = text || ''
  text = emojifyText(text, emojis, $autoplayGifs)
  text = massageStatusPlainText(text)
  return text
}
