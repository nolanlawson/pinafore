import { isFirefox } from './isFirefox'
import { thunk } from '../thunk'

export const isFirefoxPre88 = thunk(() => {
  if (!isFirefox()) {
    return false
  }
  try {
    // https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/88#javascript
    // https://github.com/tc39/proposal-regexp-match-indices
    // eslint-disable-next-line no-invalid-regexp,prefer-regex-literals
    RegExp('', 'd')
    return false
  } catch (e) {
    return true
  }
})
