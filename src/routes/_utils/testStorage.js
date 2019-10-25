// LocalStorage and IDB may be disabled in private mode, when "blocking cookies" in Safari,
// or other cases

import { thunk } from './thunk'

const testKey = '__test__'

export const testHasLocalStorage = thunk(() => {
  try {
    localStorage.setItem(testKey, testKey)
    if (!localStorage.length || localStorage.getItem(testKey) !== testKey) {
      return false
    }
    localStorage.removeItem(testKey)
  } catch (e) {
    return false
  }
  return true
})

export const testHasIndexedDB = thunk(async () => {
  if (typeof indexedDB === 'undefined') {
    return false
  }

  try {
    const idbFailed = await new Promise(resolve => {
      const db = indexedDB.open(testKey)
      db.onerror = () => resolve(true)
      db.onsuccess = () => {
        indexedDB.deleteDatabase(testKey)
        resolve(false)
      }
    })
    if (idbFailed) {
      return false
    }
  } catch (e) {
    return false
  }
  return true
})
