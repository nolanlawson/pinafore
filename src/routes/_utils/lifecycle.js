// the page-lifecycle package causes some problems (doesn't work in node),
// and plus it's not needed immediately, so lazy-load it
import { importPageLifecycle } from './asyncModules/importPageLifecycle.js'

function addEventListener (event, func) {
  if (process.browser && !process.env.IS_SERVICE_WORKER) {
    importPageLifecycle().then(lifecycle => {
      lifecycle.addEventListener(event, func)
    })
  }
}

function removeEventListener (event, func) {
  if (process.browser && !process.env.IS_SERVICE_WORKER) {
    importPageLifecycle().then(lifecycle => {
      lifecycle.removeEventListener(event, func)
    })
  }
}

export const lifecycle = { addEventListener, removeEventListener }
