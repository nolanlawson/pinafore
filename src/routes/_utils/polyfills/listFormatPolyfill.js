// Thank you Safari
// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat#browser_compatibility
// Also note I'm not going to do anything fancy here for loading the polyfill locale data.
// Safari can just get English every time.

import '@formatjs/intl-listformat/polyfill'
import '@formatjs/intl-listformat/locale-data/en'
