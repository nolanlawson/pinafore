/* global __routes__ */

import { init } from 'sapper/runtime.js'
import { offlineNotifiction } from '../routes/_utils/offlineNotification'
import { serviceWorkerClient } from '../routes/_utils/serviceWorkerClient'
import { loadPolyfills } from '../routes/_utils/loadPolyfills'

console.log(offlineNotifiction, serviceWorkerClient)

loadPolyfills().then(() => {
  // `routes` is an array of route objects injected by Sapper
  init(document.querySelector('#sapper'), __routes__)
})
