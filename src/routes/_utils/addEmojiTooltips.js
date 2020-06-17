import * as emojiDatabase from './emojiDatabase'

// Add a nice little tooltip to native emoji showing the shortcodes you can type to search for them
// TODO: titles are not accessible to keyboard users or touch users, and also they don't show up
// if they're part of a link... should we have another system?
export async function addEmojiTooltips (domNode) {
  if (!domNode) {
    return
  }
  const emojis = domNode.querySelectorAll('.inline-emoji')
  if (emojis.length) {
    await Promise.all(Array.from(emojis).map(async emoji => {
      const emojiData = await emojiDatabase.findByUnicodeOrName(emoji.textContent)
      if (emojiData && emojiData.shortcodes) {
        emoji.title = emojiData.shortcodes.map(_ => `:${_}:`).join(', ')
      }
    }))
  }
}
