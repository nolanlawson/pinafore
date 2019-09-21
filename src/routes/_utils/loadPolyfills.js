import {
  importCustomElementsPolyfill,
  importIndexedDBGetAllShim,
  importIntersectionObserver,
  importIntl,
  importRequestIdleCallback
} from './asyncPolyfills'

export function loadPolyfills () {
  return Promise.all([
    typeof IntersectionObserver === 'undefined' && importIntersectionObserver(),
    typeof requestIdleCallback === 'undefined' && importRequestIdleCallback(),
    !IDBObjectStore.prototype.getAll && importIndexedDBGetAllShim(),
    typeof customElements === 'undefined' && importCustomElementsPolyfill(),
    process.env.LEGACY && typeof Intl === 'undefined' && importIntl()
  ])
}
