import { init } from 'sapper/runtime.js'
import { importURLSearchParams } from '../routes/_utils/asyncModules'
import { importIntersectionObserver } from '../routes/_utils/asyncModules'

// polyfills
Promise.all([
  typeof URLSearchParams === 'undefined' && importURLSearchParams(),
  typeof IntersectionObserver === 'undefined' && importIntersectionObserver()
]).then(() => {
  // `routes` is an array of route objects injected by Sapper
  init(document.querySelector('#sapper'), __routes__)

  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.onstatechange = (e) => {
      if (e.target.state === 'redundant') {
        importToast().then(toast => toast.say('App update available. Reload to update.'));
      }
    }
  }

})