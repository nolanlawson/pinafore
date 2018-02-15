export const importURLSearchParams = () => import(
  /* webpackChunkName: 'url-search-params' */ 'url-search-params'
  ).then(Params => {
  window.URLSearchParams = Params
  Object.defineProperty(window.URL.prototype, 'searchParams', {
    get() {
      return new Params(this.search)
    }
  })
})

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

export const importWebSocketClient = () => import(
  /* webpackChunkName: '@gamestdio/websocket' */ '@gamestdio/websocket'
  ).then(mod => mod.default)

export const importPseudoVirtualList = () => import(
  /* webpackChunkName: 'PseudoVirtualList' */ '../_components/pseudoVirtualList/PseudoVirtualList.html'
  ).then(mod => mod.default)

export const importDialogs = () => import(
  /* webpackChunkName: 'dialogs' */ '../_components/dialog/dialogs.js'
  )

export const importStatusRendering = () => import(
  /* webpackChunkName: 'statusRendering' */ '../_components/statusRendering.js'
  )