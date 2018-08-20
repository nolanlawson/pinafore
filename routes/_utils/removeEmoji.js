import { replaceAll } from './strings'
import emojiRegex from 'emoji-regex'

let theEmojiRegex

export function removeEmoji (text, emojis) {
  // remove custom emoji
  if (emojis) {
    for (let emoji of emojis) {
      let shortcodeWithColons = `:${emoji.shortcode}:`
      text = replaceAll(text, shortcodeWithColons, '')
    }
  }
  // remove regular emoji
  theEmojiRegex = theEmojiRegex || emojiRegex() // only init when needed, then cache
  return text.replace(theEmojiRegex, '').trim()
}
