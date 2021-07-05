import { store } from '../store.js'
import * as emojiDatabase from '../../_utils/emojiDatabase.js'
import { convertCustomEmojiToEmojiPickerFormat } from '../../_utils/convertCustomEmojiToEmojiPickerFormat.js'

export function customEmojiObservers () {
  if (!process.browser) {
    return
  }

  function setEmoji (currentEmoji, autoplayGifs) {
    const customEmojiInEmojiPickerFormat = convertCustomEmojiToEmojiPickerFormat(currentEmoji, autoplayGifs)
    emojiDatabase.setCustomEmoji(customEmojiInEmojiPickerFormat)
  }

  store.observe('currentCustomEmoji', currentCustomEmoji => {
    setEmoji(currentCustomEmoji, store.get().autoplayGifs)
  }, { init: false })

  store.observe('autoplayGifs', autoplayGifs => {
    setEmoji(store.get().currentCustomEmoji, autoplayGifs)
  }, { init: false })
}
