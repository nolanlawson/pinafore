import './routes/_thirdparty/regenerator-runtime/runtime.js'
import * as sapper from '../__sapper__/client.js'
import { loadPolyfills } from './routes/_utils/loadPolyfills'
import './routes/_utils/serviceWorkerClient'
import './routes/_utils/historyEvents'
import './routes/_utils/loadingMask'
import './routes/_utils/forceOnline'

// TODO: when some browser supports :focus-visible, feature-detect and async load polyfill
// Firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=1445482
// WebKit: https://bugs.webkit.org/show_bug.cgi?id=185859
// Chrome: https://bugs.chromium.org/p/chromium/issues/detail?id=817199
// Chrome ITS: https://groups.google.com/a/chromium.org/forum/#!msg/blink-dev/XKNtAVyO4AY/ujOrvaYsBwAJ
import 'focus-visible'

loadPolyfills().then(() => {
  console.log('init()')
  sapper.start({ target: document.querySelector('#sapper') })
})

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

if (module.hot) {
  module.hot.accept()
}
