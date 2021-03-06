import {
  importRequestIdleCallback,
  importRelativeTimeFormat,
  importListFormat
} from './asyncPolyfills'

export function loadPolyfills () {
  return Promise.all([
    typeof requestIdleCallback !== 'function' && importRequestIdleCallback(),
    (
      typeof Intl.RelativeTimeFormat !== 'function' ||
      typeof Intl.Locale !== 'function' ||
      typeof Intl.PluralRules !== 'function'
    ) && importRelativeTimeFormat(),
    typeof Intl.ListFormat !== 'function' && importListFormat()
  ])
}
