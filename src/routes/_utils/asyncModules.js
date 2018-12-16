const getDefault = mod => mod.default

export const importTimeline = () => import(
  /* webpackChunkName: 'Timeline' */ '../_components/timeline/Timeline.html'
  ).then(getDefault)

export const importPageLifecycle = () => import(
  /* webpackChunkName: 'page-lifecycle' */ 'page-lifecycle/dist/lifecycle.mjs'
  ).then(getDefault)

export const importWebSocketClient = () => import(
  /* webpackChunkName: '@gamestdio/websocket' */ '@gamestdio/websocket'
  ).then(getDefault)

export const importVirtualList = () => import(
  /* webpackChunkName: 'VirtualList.html' */ '../_components/virtualList/VirtualList.html'
  ).then(getDefault)

export const importList = () => import(
  /* webpackChunkName: 'List.html' */ '../_components/list/List.html'
  ).then(getDefault)

export const importStatusVirtualListItem = () => import(
  /* webpackChunkName: 'StatusVirtualListItem.html' */ '../_components/timeline/StatusVirtualListItem.html'
  ).then(getDefault)

export const importNotificationVirtualListItem = () => import(
  /* webpackChunkName: 'NotificationVirtualListItem.html' */ '../_components/timeline/NotificationVirtualListItem.html'
  ).then(getDefault)

export const importDatabase = () => import(
  /* webpackChunkName: 'database.js' */ '../_database/databaseApis.js'
  )
