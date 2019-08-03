import { replaceAll } from './strings'
import { replaceEmoji } from './replaceEmoji'

export function removeEmoji (text, emojis) {
  // remove custom emoji
  if (emojis) {
    for (const emoji of emojis) {
      const shortcodeWithColons = `:${emoji.shortcode}:`
      text = replaceAll(text, shortcodeWithColons, '')
    }
  }
  // remove native emoji
  return replaceEmoji(text, () => '').trim()
}
