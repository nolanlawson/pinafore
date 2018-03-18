import { init } from 'sapper/runtime.js'
import { routes } from './manifest/client.js'
import { loadPolyfills } from '../routes/_utils/loadPolyfills'
import '../routes/_utils/serviceWorkerClient'
import '../routes/_utils/historyEvents'
import '../routes/_utils/loadingMask'

loadPolyfills().then(() => {
  console.log('init()')
  // `routes` is an array of route objects injected by Sapper
  init(document.querySelector('#sapper'), routes)
})

if (module.hot) {
  module.hot.accept()
}
