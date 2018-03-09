import {
  importIntersectionObserver,
  importRequestIdleCallback,
  importIndexedDBGetAllShim
} from './asyncModules'

export function loadPolyfills () {
  return Promise.all([
    typeof IntersectionObserver === 'undefined' && importIntersectionObserver(),
    typeof requestIdleCallback === 'undefined' && importRequestIdleCallback(),
    !IDBObjectStore.prototype.getAll && importIndexedDBGetAllShim()
  ])
}
