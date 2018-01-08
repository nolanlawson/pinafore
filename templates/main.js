import { init } from 'sapper/runtime.js';

// polyfills
Promise.all([
  typeof URLSearchParams === 'undefined' && import('url-search-params').then(Params => {
    window.URLSearchParams = Params
    Object.defineProperty(window.URL.prototype, 'searchParams', {
      get() {
        return new Params(this.search)
      }
    })
  })
]).then(() => {
  console.log('done')
  // `routes` is an array of route objects injected by Sapper
  init(document.querySelector('#sapper'), __routes__)
})