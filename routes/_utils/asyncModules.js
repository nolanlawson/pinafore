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

export {
  importURLSearchParams
}