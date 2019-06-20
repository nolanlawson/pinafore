// "lite" version of the store used in the inline script.

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
  },

  set (obj) {
    if (hasLocalStorage) {
      for (let [key, value] of Object.entries(obj)) {
        localStorage.setItem(`store_${key}`, JSON.stringify(value))
      }
    }
  }
}
