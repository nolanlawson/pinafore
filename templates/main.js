import { init } from 'sapper/runtime.js'
import { loadPolyfills } from '../routes/_utils/loadPolyfills'
import '../routes/_utils/offlineNotification'
import '../routes/_utils/serviceWorkerClient'

loadPolyfills().then(() => {
  // `routes` is an array of route objects injected by Sapper
  init(document.querySelector('#sapper'), __routes__)
})
