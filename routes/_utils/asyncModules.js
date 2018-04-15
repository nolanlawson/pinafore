export const importTimeline = () => import(
  /* webpackChunkName: 'Timeline' */ '../_components/timeline/Timeline.html'
  ).then(mod => mod.default)

export const importIntersectionObserver = () => import(
  /* webpackChunkName: 'intersection-observer' */ 'intersection-observer'
  )

export const importRequestIdleCallback = () => import(
  /* webpackChunkName: 'requestidlecallback' */ 'requestidlecallback'
  )

export const importIndexedDBGetAllShim = () => import(
  /* webpackChunkName: 'indexeddb-getall-shim' */ 'indexeddb-getall-shim'
  )

export const importWebAnimationPolyfill = () => import(
  /* webpackChunkName: 'web-animations-js' */ 'web-animations-js'
  )

export const importWebSocketClient = () => import(
  /* webpackChunkName: '@gamestdio/websocket' */ '@gamestdio/websocket'
  ).then(mod => mod.default)

export const importDialogs = () => import(
  /* webpackChunkName: 'dialogs' */ '../_components/dialog/dialogs.js'
  )