// Forked from https://github.com/jakearchibald/idb-keyval/commit/ea7d507
// Adds a function for closing the database, ala https://github.com/jakearchibald/idb-keyval/pull/65
// Also hooks it into the lifecycle frozen event
import { lifecycle } from '../../_utils/lifecycle'

class Store {
  constructor (dbName = 'keyval-store', storeName = 'keyval') {
    this.storeName = storeName
    this._dbName = dbName
    this._storeName = storeName
    this._init()
  }

  _withIDBStore (type, callback) {
    this._init()
    return this._dbp.then(db => new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, type)
      transaction.oncomplete = () => resolve()
      transaction.onabort = transaction.onerror = () => reject(transaction.error)
      callback(transaction.objectStore(this.storeName))
    }))
  }

  _init () {
    if (this._dbp) {
      return
    }
    this._dbp = new Promise((resolve, reject) => {
      const openreq = indexedDB.open(this._dbName, 1)
      openreq.onerror = () => reject(openreq.error)
      openreq.onsuccess = () => resolve(openreq.result)
      // First time setup: create an empty object store
      openreq.onupgradeneeded = () => {
        openreq.result.createObjectStore(this._storeName)
      }
    })
  }

  _close () {
    this._init()
    return this._dbp.then(db => {
      db.close()
      this._dbp = undefined
    })
  }
}

let store

function getDefaultStore () {
  if (!store) {
    store = new Store()
  }
  return store
}

function get (key) {
  const store = getDefaultStore()
  let req
  return store._withIDBStore('readonly', store => {
    req = store.get(key)
  }).then(() => req.result)
}

function set (key, value) {
  const store = getDefaultStore()
  return store._withIDBStore('readwrite', store => {
    store.put(value, key)
  })
}

function del (key) {
  const store = getDefaultStore()
  return store._withIDBStore('readwrite', store => {
    store.delete(key)
  })
}

function clear () {
  const store = getDefaultStore()
  return store._withIDBStore('readwrite', store => {
    store.clear()
  })
}

function keys () {
  const store = getDefaultStore()
  const keys = []
  return store._withIDBStore('readonly', store => {
    // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
    // And openKeyCursor isn't supported by Safari.
    (store.openKeyCursor || store.openCursor).call(store).onsuccess = function () {
      if (!this.result) {
        return
      }
      keys.push(this.result.key)
      this.result.continue()
    }
  }).then(() => keys)
}

function close () {
  const store = getDefaultStore()
  return store._close()
}

if (process.browser) {
  lifecycle.addEventListener('statechange', async event => {
    if (event.newState === 'frozen') { // page is frozen, close IDB connections
      await close()
      console.log('closed keyval DB')
    }
  })
}

export { Store, get, set, del, clear, keys, close }
