import { init } from 'sapper/runtime.js'
import { manifest } from './manifest/client.js';
import { loadPolyfills } from '../routes/_utils/loadPolyfills'
import '../routes/_utils/serviceWorkerClient'
import '../routes/_utils/historyEvents'
import '../routes/_utils/loadingMask'

loadPolyfills().then(() => {
  console.log('init()')
  init({
    target: document.querySelector('#sapper'),
    manifest
  })
})

if (module.hot) {
  module.hot.accept()
}
