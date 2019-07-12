import {
  ACCOUNTS_STORE, DB_VERSION_SNOWFLAKE_IDS, DB_VERSION_INITIAL,
  DB_VERSION_SEARCH_ACCOUNTS, META_STORE,
  NOTIFICATION_TIMELINES_STORE,
  NOTIFICATIONS_STORE, PINNED_STATUSES_STORE,
  REBLOG_ID, RELATIONSHIPS_STORE,
  STATUS_ID,
  STATUS_TIMELINES_STORE,
  STATUSES_STORE, THREADS_STORE,
  TIMESTAMP, USERNAME_LOWERCASE
} from './constants'
import { toReversePaddedBigInt } from '../_utils/statusIdSorting'

function initialMigration (db, tx, done) {
  function createObjectStore (name, init, indexes) {
    const store = init
      ? db.createObjectStore(name, init)
      : db.createObjectStore(name)
    if (indexes) {
      Object.keys(indexes).forEach(indexKey => {
        store.createIndex(indexKey, indexes[indexKey])
      })
    }
  }

  createObjectStore(STATUSES_STORE, { keyPath: 'id' }, {
    [TIMESTAMP]: TIMESTAMP,
    [REBLOG_ID]: REBLOG_ID
  })
  createObjectStore(STATUS_TIMELINES_STORE, null, {
    statusId: ''
  })
  createObjectStore(NOTIFICATIONS_STORE, { keyPath: 'id' }, {
    [TIMESTAMP]: TIMESTAMP,
    [STATUS_ID]: STATUS_ID
  })
  createObjectStore(NOTIFICATION_TIMELINES_STORE, null, {
    notificationId: ''
  })
  createObjectStore(ACCOUNTS_STORE, { keyPath: 'id' }, {
    [TIMESTAMP]: TIMESTAMP
  })
  createObjectStore(RELATIONSHIPS_STORE, { keyPath: 'id' }, {
    [TIMESTAMP]: TIMESTAMP
  })
  createObjectStore(THREADS_STORE, null, {
    statusId: ''
  })
  createObjectStore(PINNED_STATUSES_STORE, null, {
    statusId: ''
  })
  createObjectStore(META_STORE)
  done()
}

function addSearchAccountsMigration (db, tx, done) {
  tx.objectStore(ACCOUNTS_STORE)
    .createIndex(USERNAME_LOWERCASE, USERNAME_LOWERCASE)
  done()
}

function snowflakeIdsMigration (db, tx, done) {
  const stores = [STATUS_TIMELINES_STORE, NOTIFICATION_TIMELINES_STORE]
  let storeDoneCount = 0

  // Here we have to convert the old "reversePaddedBigInt" format to the new
  // one which is compatible with Pleroma-style snowflake IDs.
  stores.forEach(store => {
    const objectStore = tx.objectStore(store)
    const cursor = objectStore.openCursor()
    cursor.onsuccess = e => {
      const { result } = e.target
      if (result) {
        const { key, value } = result
        // key is timeline name plus delimiter plus reverse padded big int
        const newKey = key.split('\u0000')[0] + '\u0000' + toReversePaddedBigInt(value)

        objectStore.delete(key).onsuccess = () => {
          objectStore.add(value, newKey).onsuccess = () => {
            result.continue()
          }
        }
      } else {
        if (++storeDoneCount === stores.length) {
          done()
        }
      }
    }
  })
}

export const migrations = [
  {
    version: DB_VERSION_INITIAL,
    migration: initialMigration
  },
  {
    version: DB_VERSION_SEARCH_ACCOUNTS,
    migration: addSearchAccountsMigration
  },
  {
    version: DB_VERSION_SNOWFLAKE_IDS,
    migration: snowflakeIdsMigration
  }
]
