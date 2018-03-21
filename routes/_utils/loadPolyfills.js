import {
  importIntersectionObserver,
  importRequestIdleCallback,
  importIndexedDBGetAllShim,
  importWebAnimationPolyfill
} from './asyncModules'

export function loadPolyfills () {
  return Promise.all([
    typeof IntersectionObserver === 'undefined' && importIntersectionObserver(),
    typeof requestIdleCallback === 'undefined' && importRequestIdleCallback(),
    !IDBObjectStore.prototype.getAll && importIndexedDBGetAllShim(),
    !Element.prototype.animate && importWebAnimationPolyfill()
  ])
}
