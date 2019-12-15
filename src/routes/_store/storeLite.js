// "lite" version of the store used in the inline script.

import { safeParse } from '../_utils/safeParse'
import { testHasLocalStorage } from '../_utils/testStorage'

const hasLocalStorage = testHasLocalStorage()

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
  },

  set (obj) {
    if (hasLocalStorage) {
      for (const [key, value] of Object.entries(obj)) {
        localStorage.setItem(`store_${key}`, JSON.stringify(value))
      }
    }
  }
}
