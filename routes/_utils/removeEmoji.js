import { replaceAll } from './strings'
import { getEmojiRegex } from './emojiRegex'

function replacer (substring) {
  if (substring.match(/^[0-9]+$/)) { // for some reason, emoji-regex matches digits
    return substring
  }
  return ''
}

export function removeEmoji (text, emojis) {
  // remove custom emoji
  if (emojis) {
    for (let emoji of emojis) {
      let shortcodeWithColons = `:${emoji.shortcode}:`
      text = replaceAll(text, shortcodeWithColons, '')
    }
  }
  // remove native emoji
  return text.replace(getEmojiRegex(), replacer).trim()
}
