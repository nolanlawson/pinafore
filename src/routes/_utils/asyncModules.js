export const importTimeline = () => import(
  /* webpackChunkName: 'Timeline' */ '../_components/timeline/Timeline.html'
  ).then(mod => mod.default)

export const importIntersectionObserver = () => import(
  /* webpackChunkName: 'intersection-observer' */ 'intersection-observer'
  )

export const importRequestIdleCallback = () => import(
  /* webpackChunkName: 'requestidlecallback' */ 'requestidlecallback'
  )

export const importWebAnimationPolyfill = () => import(
  /* webpackChunkName: 'web-animations-js' */ 'web-animations-js'
  )

export const importIndexedDBGetAllShim = () => import(
  /* webpackChunkName: 'indexeddb-getall-shim' */ 'indexeddb-getall-shim'
  )

export const importWebSocketClient = () => import(
  /* webpackChunkName: '@gamestdio/websocket' */ '@gamestdio/websocket'
  ).then(mod => mod.default)

export const importVirtualList = () => import(
  /* webpackChunkName: 'VirtualList.html' */ '../_components/virtualList/VirtualList.html'
  ).then(mod => mod.default)

export const importList = () => import(
  /* webpackChunkName: 'List.html' */ '../_components/list/List.html'
  ).then(mod => mod.default)

export const importStatusVirtualListItem = () => import(
  /* webpackChunkName: 'StatusVirtualListItem.html' */ '../_components/timeline/StatusVirtualListItem.html'
  ).then(mod => mod.default)

export const importNotificationVirtualListItem = () => import(
  /* webpackChunkName: 'NotificationVirtualListItem.html' */ '../_components/timeline/NotificationVirtualListItem.html'
  ).then(mod => mod.default)
