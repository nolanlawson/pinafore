import {
  importCustomElementsPolyfill,
  importFocusVisible,
  importIndexedDBGetAllShim,
  importIntersectionObserver,
  importIntl,
  importRequestIdleCallback
} from './asyncPolyfills'
import { supportsSelector } from './supportsSelector'

export function loadPolyfills () {
  return Promise.all([
    typeof IntersectionObserver === 'undefined' && importIntersectionObserver(),
    typeof requestIdleCallback === 'undefined' && importRequestIdleCallback(),
    !IDBObjectStore.prototype.getAll && importIndexedDBGetAllShim(),
    typeof customElements === 'undefined' && importCustomElementsPolyfill(),
    process.env.LEGACY && typeof Intl === 'undefined' && importIntl(),
    !supportsSelector(':focus-visible') && importFocusVisible()
  ])
}
