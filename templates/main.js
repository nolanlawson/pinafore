import { init } from 'sapper/runtime.js';

// polyfills
Promise.all([
  typeof URLSearchParams === 'undefined' && import(/* webpackChunkName: 'url-search-params' */ 'url-search-params').then(Params => {
    window.URLSearchParams = Params
    Object.defineProperty(window.URL.prototype, 'searchParams', {
      get() {
        return new Params(this.search)
      }
    })
  })
]).then(() => {
  // `routes` is an array of route objects injected by Sapper
  init(document.querySelector('#sapper'), __routes__)
})