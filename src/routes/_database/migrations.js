import {
  ACCOUNTS_STORE, DB_VERSION_BASE62_IDS, DB_VERSION_INITIAL,
  DB_VERSION_SEARCH_ACCOUNTS, META_STORE,
  NOTIFICATION_TIMELINES_STORE,
  NOTIFICATIONS_STORE, PINNED_STATUSES_STORE,
  REBLOG_ID, RELATIONSHIPS_STORE,
  STATUS_ID,
  STATUS_TIMELINES_STORE,
  STATUSES_STORE, THREADS_STORE,
  TIMESTAMP, USERNAME_LOWERCASE
} from './constants'

function initialMigration (db) {
  function createObjectStore (name, init, indexes) {
    let store = init
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
    'statusId': ''
  })
  createObjectStore(NOTIFICATIONS_STORE, { keyPath: 'id' }, {
    [TIMESTAMP]: TIMESTAMP,
    [STATUS_ID]: STATUS_ID
  })
  createObjectStore(NOTIFICATION_TIMELINES_STORE, null, {
    'notificationId': ''
  })
  createObjectStore(ACCOUNTS_STORE, { keyPath: 'id' }, {
    [TIMESTAMP]: TIMESTAMP
  })
  createObjectStore(RELATIONSHIPS_STORE, { keyPath: 'id' }, {
    [TIMESTAMP]: TIMESTAMP
  })
  createObjectStore(THREADS_STORE, null, {
    'statusId': ''
  })
  createObjectStore(PINNED_STATUSES_STORE, null, {
    'statusId': ''
  })
  createObjectStore(META_STORE)
}

function addSearchAccountsMigration (db, tx) {
  tx.objectStore(ACCOUNTS_STORE)
    .createIndex(USERNAME_LOWERCASE, USERNAME_LOWERCASE)
}

function useBase62IdsMigration (db, tx) {

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
    version: DB_VERSION_BASE62_IDS,
    migration: useBase62IdsMigration
  }
]
