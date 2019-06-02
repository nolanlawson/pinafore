// "lite" version of the store used in the inline script. Purely read-only,
// does not implement non-LocalStorage store features.

import { safeParse } from './safeParse'
import { testHasLocalStorageOnce } from '../_utils/testStorage'

const hasLocalStorage = testHasLocalStorageOnce()

export const storeLite = {
  get () {
    return new Proxy({}, {
      get: function (obj, prop) {
        if (!(prop in obj)) {
          obj[prop] = hasLocalStorage && safeParse(localStorage.getItem(`store_${prop}`))
        }
        return obj[prop]
      }
    })
  }
}
