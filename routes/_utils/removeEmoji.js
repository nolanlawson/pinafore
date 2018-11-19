import { replaceAll } from './strings'
import { getEmojiRegex } from './emojiRegex'

export function removeEmoji (text, emojis) {
  // remove custom emoji
  if (emojis) {
    for (let emoji of emojis) {
      let shortcodeWithColons = `:${emoji.shortcode}:`
      text = replaceAll(text, shortcodeWithColons, '')
    }
  }
  // remove native emoji
  return text.replace(getEmojiRegex(), '').trim()
}
