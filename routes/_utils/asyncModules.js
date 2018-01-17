const importURLSearchParams = () => import(
  /* webpackChunkName: 'url-search-params' */ 'url-search-params'
  ).then(Params => {
  window.URLSearchParams = Params
  Object.defineProperty(window.URL.prototype, 'searchParams', {
    get() {
      return new Params(this.search)
    }
  })
})

const importTimeline = () => import(
  /* webpackChunkName: 'Timeline' */ '../_components/Timeline.html'
  ).then(mod => mod.default)

const importIntersectionObserver = () => import(
  /* webpackChunkname: 'intersection-observer' */ 'intersection-observer'
  )

export {
  importURLSearchParams,
  importTimeline,
  importIntersectionObserver
}