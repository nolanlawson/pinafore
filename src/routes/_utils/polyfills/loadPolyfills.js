import {
  importDynamicViewportUnitsPolyfill,
  importIntlListFormat,
  importIntlLocale, importIntlPluralRules, importIntlRelativeTimeFormat,
  importRequestIdleCallback
} from './asyncPolyfills.js'
import { mark, stop } from '../marks.js'

async function loadIntlPolyfillsIfNecessary () {
  // Have to chain these so that they load in the proper order.
  // Luckily these requests aren't done in serial, because we're using the same Webpack
  // chunk name for each one.
  if (typeof Intl.Locale !== 'function') {
    await importIntlLocale()
  }
  if (typeof Intl.PluralRules !== 'function') {
    await importIntlPluralRules()
  }
  await Promise.all([
    typeof Intl.RelativeTimeFormat !== 'function' && importIntlRelativeTimeFormat(),
    typeof Intl.ListFormat !== 'function' && importIntlListFormat()
  ])
}

export async function loadPolyfills () {
  mark('loadPolyfills')
  await Promise.all([
    typeof requestIdleCallback !== 'function' && importRequestIdleCallback(),
    loadIntlPolyfillsIfNecessary(),
    !CSS.supports('height: 1dvh') && importDynamicViewportUnitsPolyfill()
  ])
  stop('loadPolyfills')
}
