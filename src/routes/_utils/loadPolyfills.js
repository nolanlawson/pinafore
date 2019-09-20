import {
  importCustomElementsPolyfill,
  importIndexedDBGetAllShim,
  importIntersectionObserver,
  importIntl,
  importRequestIdleCallback,
  importStringPolyfills,
  importArrayIncludes
} from './asyncPolyfills'

export function loadPolyfills () {
  return Promise.all([
    typeof IntersectionObserver === 'undefined' && importIntersectionObserver(),
    typeof requestIdleCallback === 'undefined' && importRequestIdleCallback(),
    !IDBObjectStore.prototype.getAll && importIndexedDBGetAllShim(),
    typeof customElements === 'undefined' && importCustomElementsPolyfill(),
    typeof Intl === 'undefined' && importIntl(),
    (!String.prototype.endsWith || !String.prototype.includes || !String.prototype.trim) && importStringPolyfills(),
    !Array.prototype.includes && importArrayIncludes()
  ])
}
