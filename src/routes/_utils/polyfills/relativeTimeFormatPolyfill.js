// Making this a single module so it gets bundled into a single chunk.
// As it turns out, thanks to iOS 13, we need to not only support Intl.RelativeTimeFormat, but
// also Intl.Locale and Intl.PluralRules. When iOS 13 is not so widespread, we can remove this.
// Also note I'm not going to do anything fancy here for loading the polyfill locale data.
// iOS 13 can just get English every time.
// https://caniuse.com/mdn-javascript_builtins_intl_relativetimeformat

import '@formatjs/intl-locale/polyfill'
import '@formatjs/intl-pluralrules/polyfill'
import '@formatjs/intl-pluralrules/locale-data/en'
import '@formatjs/intl-relativetimeformat/polyfill'
import '@formatjs/intl-relativetimeformat/locale-data/en'
