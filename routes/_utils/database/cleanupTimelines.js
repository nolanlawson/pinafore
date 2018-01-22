import { getKnownDbs } from './knownDbs'
import debounce from 'lodash/debounce'
import { TIMELINE_STORE, getTimelineDatabase } from './timelines'

const MAX_NUM_STORED_STATUSES = 1000
const CLEANUP_INTERVAL = 60000

async function cleanup(instanceName, timeline) {
  const db = await getTimelineDatabase(instanceName, timeline)
  return await new Promise((resolve, reject) => {
    const tx = db.transaction(TIMELINE_STORE, 'readwrite')
    const store = tx.objectStore(TIMELINE_STORE)
    const index = store.index('pinafore_id_as_negative_big_int')

    store.count().onsuccess = (e) => {
      let count = e.target.result
      if (count <= MAX_NUM_STORED_STATUSES) {
        return
      }
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
  if (process.env.NODE_ENV !== 'production') {
    console.log('cleanupOldStatuses')
  }

  let knownDbs = await getKnownDbs()
  let instanceNames = Object.keys(knownDbs)
  for (let instanceName of instanceNames) {
    let knownDbsForInstance = knownDbs[instanceName] || []
    for (let knownDb of knownDbsForInstance) {
      let {type, dbName} = knownDb
      if (type !== 'timeline') {
        continue
      }
      let timeline = dbName.split('_').slice(-1)
      await cleanup(instanceName, timeline)
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    console.log('done cleanupOldStatuses')
  }
}, CLEANUP_INTERVAL)