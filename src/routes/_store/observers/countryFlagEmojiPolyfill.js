import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'
import { store } from '../store.js'
import { COUNTRY_FLAG_FONT_FAMILY, COUNTRY_FLAG_FONT_URL } from '../../_static/fonts.js'

let polyfilled = false

export function countryFlagEmojiPolyfill () {
  if (!polyfilled) {
    polyfilled = true
    const numStylesBefore = document.head.querySelectorAll('style').length
    polyfillCountryFlagEmojis(COUNTRY_FLAG_FONT_FAMILY, COUNTRY_FLAG_FONT_URL)
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
    }
    store.set({ polyfilledCountryFlagEmoji: polyfillActivated })
  }
}
