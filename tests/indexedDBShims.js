import indexedDB from 'fake-indexeddb'
import IDBKeyRange from 'fake-indexeddb/build/FDBKeyRange.js'

global.indexedDB = indexedDB
global.IDBKeyRange = IDBKeyRange.default
