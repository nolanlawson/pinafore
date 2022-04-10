import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'
import { store } from '../store.js'

let polyfilled = false

const COUNTRY_FLAG_FONT_URL = '/TwemojiCountryFlags.woff2'

export function countryFlagEmojiPolyfill () {
  if (!polyfilled) {
    polyfilled = true
    const numStylesBefore = document.head.querySelectorAll('style').length
    polyfillCountryFlagEmojis('Twemoji Mozilla', COUNTRY_FLAG_FONT_URL)
    const numStylesAfter = document.head.querySelectorAll('style').length
    // if a style was added, then the polyfill was activated
    const polyfillActivated = numStylesAfter !== numStylesBefore
    if (polyfillActivated) {
      const style = document.createElement('style')
      style.textContent = `
        @font-face {
          font-family: CountryFlagEmojiPolyfill;
          src: url(${JSON.stringify(COUNTRY_FLAG_FONT_URL)});
        }
      `
      document.head.appendChild(style)
      // "Twemoji Mozilla" is for emoji-picker-element, since it lists that font first.
      // "CountryFlagEmojiPolyfill" is for us so we can set it before everything else in our own font family lists.
    }
    store.set({ polyfilledCountryFlagEmoji: polyfillActivated })
  }
}
