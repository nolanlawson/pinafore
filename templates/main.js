import { init } from 'sapper/runtime.js'
import { offlineNotifiction } from '../routes/_utils/offlineNotification'
import { serviceWorkerClient } from '../routes/_utils/serviceWorkerClient'

import {
  importURLSearchParams,
  importIntersectionObserver,
  importRequestIdleCallback,
  importIndexedDBGetAllShim,
  importDialogPolyfill
} from '../routes/_utils/asyncModules'

// polyfills
Promise.all([
  typeof URLSearchParams === 'undefined' && importURLSearchParams(),
  typeof IntersectionObserver === 'undefined' && importIntersectionObserver(),
  typeof requestIdleCallback === 'undefined' && importRequestIdleCallback(),
  !IDBObjectStore.prototype.getAll && importIndexedDBGetAllShim(),
  typeof HTMLDialogElement === 'undefined' && importDialogPolyfill()
]).then(() => {
  // `routes` is an array of route objects injected by Sapper
  init(document.querySelector('#sapper'), __routes__)
})