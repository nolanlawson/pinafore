import { init } from 'sapper/runtime.js'
import { toast } from '../routes/_utils/toast'
import {
  importURLSearchParams,
  importIntersectionObserver,
  importRequestIdleCallback,
  importIndexedDBGetAllShim,
} from '../routes/_utils/asyncModules'

// polyfills
Promise.all([
  typeof URLSearchParams === 'undefined' && importURLSearchParams(),
  typeof IntersectionObserver === 'undefined' && importIntersectionObserver(),
  typeof requestIdleCallback === 'undefined' && importRequestIdleCallback(),
  !IDBObjectStore.prototype.getAll && importIndexedDBGetAllShim()
]).then(() => {
  // `routes` is an array of route objects injected by Sapper
  init(document.querySelector('#sapper'), __routes__)

  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.onstatechange = (e) => {
      if (e.target.state === 'redundant') {
        toast.say('App update available. Reload to update.');
      }
    }
  }

})