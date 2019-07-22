// LocalStorage and IDB may be disabled in private mode, when "blocking cookies" in Safari,
// or other cases

import { thunk } from './thunk'

const testKey = '__test__'

export const testHasLocalStorageOnce = () => {
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
}

export const testHasLocalStorage = thunk(testHasLocalStorageOnce)

export const testHasIndexedDB = thunk(async () => {
  if (typeof indexedDB === 'undefined') {
    return false
  }

  try {
    let idbFailed = await new Promise(resolve => {
      let db = indexedDB.open(testKey)
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
