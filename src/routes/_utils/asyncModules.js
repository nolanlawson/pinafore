const getDefault = mod => mod.default

export const importTimeline = () => import(
  /* webpackChunkName: 'Timeline' */ '../_components/timeline/Timeline.html'
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

export const importLoggedInStoreExtensions = () => import(
  /* webpackChunkName: 'loggedInStoreExtensions.js' */ '../_store/loggedInStoreExtensions.js'
)

export const importNavShortcuts = () => import(
  /* webpackChunkName: 'NavShortcuts' */ '../_components/NavShortcuts.html'
).then(getDefault)

export const importEmojiMart = () => import(
  /* webpackChunkName: 'createEmojiMartPickerFromData.js' */ '../_react/createEmojiMartPickerFromData.js'
).then(getDefault)

export const importToast = () => import(
  /* webpackChunkName: 'Toast.html' */ '../_components/toast/Toast.html'
).then(getDefault)

export const importSnackbar = () => import(
  /* webpackChunkName: 'Snackbar.html' */ '../_components/snackbar/Snackbar.html'
).then(getDefault)

export const importComposeBox = () => import(
  /* webpackChunkName: 'ComposeBox.html' */ '../_components/compose/ComposeBox.html'
).then(getDefault)

export const importTesseractWorker = () => import(
  /* webpackChunkName: 'tesseractWorker' */ '../_utils/tesseractWorker.js'
).then(getDefault)

export const importVirtualListStore = () => import(
  /* webpackChunkName: 'virtualListStore.js' */ '../_components/virtualList/virtualListStore.js'
)
