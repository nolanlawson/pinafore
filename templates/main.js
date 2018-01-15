import { init } from 'sapper/runtime.js'
import toast from '../routes/_utils/toast.js'

// polyfills
Promise.all([
  typeof URLSearchParams === 'undefined' && importURLParams()
]).then(() => {
  // `routes` is an array of route objects injected by Sapper
  init(document.querySelector('#sapper'), __routes__)

  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.onstatechange = (e) => {
      if (e.target.state === 'redundant') {
        toast.say('App update available. Reload to update.');
      }
    }
  }

})