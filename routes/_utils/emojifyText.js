import { replaceAll } from './strings'

export function emojifyText (text, emojis, autoplayGifs) {
  if (emojis && emojis.length) {
    for (let emoji of emojis) {
      let urlToUse = autoplayGifs ? emoji.url : emoji.static_url
      let shortcodeWithColons = `:${emoji.shortcode}:`
      text = replaceAll(
        text,
        shortcodeWithColons,
        `<img class="status-emoji" draggable="false" src="${urlToUse}"
                    alt="${shortcodeWithColons}" title="${shortcodeWithColons}" />`
      )
    }
  }
  return text
}
