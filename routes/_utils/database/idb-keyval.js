import idb from 'idb'

// copypasta'd from https://github.com/jakearchibald/idb#keyval-store

const dbPromise = idb.open('keyval-store', 1, upgradeDB => {
  upgradeDB.createObjectStore('keyval')
})

const idbKeyval = {
  get(key) {
    return dbPromise.then(db => {
      return db.transaction('keyval').objectStore('keyval').get(key)
    })
  },
  set(key, val) {
    return dbPromise.then(db => {
      const tx = db.transaction('keyval', 'readwrite')
      tx.objectStore('keyval').put(val, key)
      return tx.complete
    })
  },
  delete(key) {
    return dbPromise.then(db => {
      const tx = db.transaction('keyval', 'readwrite')
      tx.objectStore('keyval').delete(key)
      return tx.complete
    })
  },
  clear() {
    return dbPromise.then(db => {
      const tx = db.transaction('keyval', 'readwrite')
      tx.objectStore('keyval').clear()
      return tx.complete
    })
  },
  keys() {
    return dbPromise.then(db => {
      const tx = db.transaction('keyval')
      const keys = []
      const store = tx.objectStore('keyval')
      // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
      // openKeyCursor isn't supported by Safari, so we fall back
      const iterate = store.iterateKeyCursor || store.iterateCursor
      iterate.call(store, cursor => {
        if (!cursor) {
          return
        }
        keys.push(cursor.key)
        cursor.continue()
      })

      return tx.complete.then(() => keys)
    })
  }
}

export default idbKeyval