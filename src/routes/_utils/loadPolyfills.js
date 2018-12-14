import {
  importIndexedDBGetAllShim,
  importIntersectionObserver,
  importRequestIdleCallback,
  importWebAnimationPolyfill
} from './asyncModules.js'

export function loadPolyfills () {
  return Promise.all([
    typeof IntersectionObserver === 'undefined' && importIntersectionObserver(),
    typeof requestIdleCallback === 'undefined' && importRequestIdleCallback(),
    !Element.prototype.animate && importWebAnimationPolyfill(),
    !IDBObjectStore.prototype.getAll && importIndexedDBGetAllShim()
  ])
}
