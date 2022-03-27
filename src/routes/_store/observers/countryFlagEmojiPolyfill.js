import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'

let polyfilled = false

export function countryFlagEmojiPolyfill () {
  if (!polyfilled) {
    polyfilled = true
    polyfillCountryFlagEmojis('Twemoji Mozilla', '/TwemojiCountryFlags.woff2')
  }
}
