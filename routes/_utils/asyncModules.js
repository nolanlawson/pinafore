import { loadCSS } from 'fg-loadcss';

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
  /* webpackChunkName: 'Timeline' */ '../_components/Timeline.html'
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

export const importDialogPolyfill = (() => {
  let cached
  return () => {
    if (cached) {
      return Promise.resolve(cached)
    }
    loadCSS('/dialog-polyfill.css') // TODO: handle error
    return import(/* webpackChunkName: 'dialog-polyfill' */ 'dialog-polyfill').then(res => {
      cached = res
      return cached
    })
  }
})()