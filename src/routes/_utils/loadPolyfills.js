import {
  importCustomElementsPolyfill,
  importIndexedDBGetAllShim,
  importIntersectionObserver,
  importRequestIdleCallback,
  importWebAnimationPolyfill
} from './asyncModules'

export function loadPolyfills () {
  return Promise.all([
    typeof IntersectionObserver === 'undefined' && importIntersectionObserver(),
    typeof requestIdleCallback === 'undefined' && importRequestIdleCallback(),
    !Element.prototype.animate && importWebAnimationPolyfill(),
    !IDBObjectStore.prototype.getAll && importIndexedDBGetAllShim(),
    typeof customElements === 'undefined' && importCustomElementsPolyfill()
  ])
}
