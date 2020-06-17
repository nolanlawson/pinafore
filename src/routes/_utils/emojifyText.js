import { replaceAll } from './strings'
import { replaceEmoji } from './replaceEmoji'

export function emojifyText (text, emojis, autoplayGifs) {
  // replace native emoji with wrapped spans so we can give them the proper font-family
  // as well as show tooltips
  text = replaceEmoji(text, substring => `<span class="inline-emoji">${substring}</span>`)

  // replace custom emoji
  if (emojis) {
    for (const emoji of emojis) {
      const urlToUse = autoplayGifs ? emoji.url : emoji.static_url
      const shortcodeWithColons = `:${emoji.shortcode}:`
      text = replaceAll(
        text,
        shortcodeWithColons,
        `<img class="inline-custom-emoji" draggable="false" src="${urlToUse}"
                    alt="${shortcodeWithColons}" title="${shortcodeWithColons}" />`
      )
    }
  }

  return text
}
