// LocalStorage and IDB may be disabled in private mode, when "blocking cookies" in Safari,
// or other cases

import { thunk } from './thunk'

const TEST_KEY = '__test__'

export const testHasLocalStorageOnce = () => {
  try {
    const LS = localStorage
    LS[TEST_KEY] = TEST_KEY
    if (!LS.length || LS[TEST_KEY] !== TEST_KEY) {
      return false
    }
    delete LS[TEST_KEY]
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
      let db = indexedDB.open(TEST_KEY)
      db.onerror = () => resolve(true)
      db.onsuccess = () => {
        indexedDB.deleteDatabase(TEST_KEY)
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
