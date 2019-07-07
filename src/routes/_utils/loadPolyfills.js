import {
  importCustomElementsPolyfill,
  importIndexedDBGetAllShim,
  importIntersectionObserver,
  importRequestIdleCallback,
  importPointerEventsPolyfill
} from './asyncPolyfills'

export function loadPolyfills () {
  return Promise.all([
    typeof IntersectionObserver === 'undefined' && importIntersectionObserver(),
    typeof requestIdleCallback === 'undefined' && importRequestIdleCallback(),
    !IDBObjectStore.prototype.getAll && importIndexedDBGetAllShim(),
    typeof customElements === 'undefined' && importCustomElementsPolyfill(),
    typeof PointerEvent === 'undefined' && importPointerEventsPolyfill()
  ])
}
