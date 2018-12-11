export function fetchAccount (accountsStore, id, callback) {
  accountsStore.get(id).onsuccess = e => {
    callback(e.target.result)
  }
}
