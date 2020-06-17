export function convertCustomEmojiToEmojiPickerFormat (customEmoji, autoplayGifs) {
  if (!customEmoji) {
    return []
  }
  return customEmoji.filter(emoji => emoji.visible_in_picker).map(emoji => ({
    name: emoji.shortcode,
    shortcodes: [emoji.shortcode],
    url: autoplayGifs ? emoji.url : emoji.static_url,
    category: emoji.category
  }))
}
