export function deleteAll (store, index, keyRange) {
  index.getAllKeys(keyRange).onsuccess = e => {
    for (let result of e.target.result) {
      store.delete(result)
    }
  }
}
