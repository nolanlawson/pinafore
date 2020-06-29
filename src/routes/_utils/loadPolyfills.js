import {
  importArrayFlat,
  importCustomElementsPolyfill,
  importIndexedDBGetAllShim,
  importIntersectionObserver,
  importIntl,
  importRequestIdleCallback,
  importShadowDomPolyfill
} from './asyncPolyfills'

export function loadPolyfills () {
  return Promise.all([
    typeof requestIdleCallback === 'undefined' && importRequestIdleCallback(),
    // these legacy polyfills should be kept in sync with webpack/shared.config.js
    process.env.LEGACY && !Array.prototype.flat && importArrayFlat(),
    process.env.LEGACY && !IDBObjectStore.prototype.getAll && importIndexedDBGetAllShim(),
    process.env.LEGACY && typeof IntersectionObserver === 'undefined' && importIntersectionObserver(),
    process.env.LEGACY && typeof Intl === 'undefined' && importIntl(),
    process.env.LEGACY && typeof customElements === 'undefined' && importCustomElementsPolyfill(),
    process.env.LEGACY && !HTMLElement.prototype.attachShadow && importShadowDomPolyfill()
  ])
}
