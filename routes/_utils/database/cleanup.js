import keyval from "idb-keyval"
import debounce from 'lodash/debounce'
import { OBJECT_STORE, getDatabase } from './shared'

const MAX_NUM_STORED_STATUSES = 1000
const CLEANUP_INTERVAL = 60000

async function cleanup(instanceName, timeline) {
  const db = await getDatabase(instanceName, timeline)
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(OBJECT_STORE, 'readwrite')
    const store = tx.objectStore(OBJECT_STORE)
    const index = store.index('pinafore_id_as_negative_big_int')

    store.count().onsuccess = (e) => {
      let count = e.target.result
      let openKeyCursor = index.openKeyCursor || index.openCursor
      openKeyCursor.call(index, null, 'prev').onsuccess = (e) => {
        let cursor = e.target.result
        if (--count < MAX_NUM_STORED_STATUSES || !cursor) {
          return
        }
        store.delete(cursor.primaryKey).onsuccess = () => {
          cursor.continue()
        }
      }
    }
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error.name + ' ' + tx.error.message)
  })
}

export const cleanupOldStatuses = debounce(async () => {
  console.log('cleanupOldStatuses')
  let knownDbs = (await keyval.get('known_dbs')) || {}
  let dbNames = Object.keys(knownDbs)
  for (let dbName of dbNames) {
    let [ instanceName, timeline ] = knownDbs[dbName]
    await cleanup(instanceName, timeline)
  }
  console.log('done cleanupOldStatuses')
}, CLEANUP_INTERVAL)