import { testColorEmojiSupported } from './testColorEmojiSupported'
import { testEmojiRenderedAtCorrectSize } from './testEmojiRenderedAtCorrectSize'
import { QuickLRU } from '../_thirdparty/quick-lru/quick-lru'

// avoid recomputing emoji support over and over again
const emojiSupportCache = new QuickLRU({
  maxSize: 500
})

export function testEmojiSupported (unicode) {
  let supported = emojiSupportCache.get(unicode)
  if (typeof supported !== 'boolean') {
    supported = !!(testColorEmojiSupported(unicode) && testEmojiRenderedAtCorrectSize(unicode))
    emojiSupportCache.set(unicode, supported)
  }
  return supported
}
