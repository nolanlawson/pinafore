export function deleteAll (store, index, keyRange) {
  index.getAllKeys(keyRange).onsuccess = e => {
    for (const result of e.target.result) {
      store.delete(result)
    }
  }
}
