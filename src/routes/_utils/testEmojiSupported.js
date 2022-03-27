import { isEmojiSupported, setCacheHandler } from '../_thirdparty/is-emoji-supported/is-emoji-supported.js'
import { QuickLRU } from '../_thirdparty/quick-lru/quick-lru.js'
import { store } from '../_store/store.js'
import { COUNTRY_FLAG_FONT_FAMILY, COUNTRY_FLAG_FONT_URL } from '../_static/fonts.js'

// avoid recomputing emoji support over and over again
// use our own LRU since the built-in one grows forever, which is a small memory leak, but still
setCacheHandler(new QuickLRU({ maxSize: 500 }))

let loadedFlagEmojiPolyfillFont = false

export async function testEmojiSupported(unicode) {
  if (store.get().polyfilledCountryFlagEmoji && !loadedFlagEmojiPolyfillFont) {
    // if we're using the country flag emoji polyfill, then we have to make sure the font is loaded first
    const fontFace = new FontFace(COUNTRY_FLAG_FONT_FAMILY, `url(${JSON.stringify(COUNTRY_FLAG_FONT_URL)})`)
    await fontFace.load()
    loadedFlagEmojiPolyfillFont = true
  }
  return isEmojiSupported(unicode)
}
