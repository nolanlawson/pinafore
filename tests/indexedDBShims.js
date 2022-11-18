import { indexedDB, IDBKeyRange } from 'fake-indexeddb'

global.indexedDB = indexedDB
global.IDBKeyRange = IDBKeyRange
