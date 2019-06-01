// "lite" version of the store used in the inline script. Purely read-only,
// does not implement non-LocalStorage store features.

import { safeParse } from './safeParse'
import { testHasLocalStorageOnce } from '../_utils/testStorage'

const hasLocalStorage = testHasLocalStorageOnce()

export const storeLite = {
  get () {
    if (!hasLocalStorage) {
      return {}
    }
    const res = {}
    const LS = localStorage
    for (let i = 0, len = LS.length; i < len; i++) {
      let key = LS.key(i)
      if (key.startsWith('store_')) {
        let item = LS.getItem(key)
        let value = safeParse(item)
        res[key] = value
      }
    }
    return res
  }
}
