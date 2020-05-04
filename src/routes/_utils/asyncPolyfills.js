export const importIntersectionObserver = () => import(
  /* webpackChunkName: '$polyfill$-intersection-observer' */ 'intersection-observer'
)

export const importRequestIdleCallback = () => import(
  /* webpackChunkName: '$polyfill$-requestidlecallback' */ 'requestidlecallback'
)

export const importIndexedDBGetAllShim = () => import(
  /* webpackChunkName: '$polyfill$-indexeddb-getall-shim' */ 'indexeddb-getall-shim'
)

export const importCustomElementsPolyfill = () => import(
  /* webpackChunkName: '$polyfill$-@webcomponents/custom-elements' */ '@webcomponents/custom-elements'
)

export const importIntl = () => import(
  /* webpackChunkName: '$polyfill$-intl' */ 'intl'
)

export const importFocusVisible = () => import(
  /* webpackChunkName: '$polyfill$-focus-visible' */ 'focus-visible'
)
