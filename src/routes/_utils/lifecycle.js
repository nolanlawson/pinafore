// the page-lifecycle package causes some problems (doesn't work in node, busts the webpack cache),
// so load asynchronously
import { importPageLifecycle } from './asyncModules'

function addEventListener (event, func) {
  if (process.browser) {
    importPageLifecycle().then(lifecycle => lifecycle.addEventListener(event, func))
  }
}

function removeEventListener (event, func) {
  if (process.browser) {
    importPageLifecycle().then(lifecycle => lifecycle.removeEventListener(event, func))
  }
}

export const lifecycle = { addEventListener, removeEventListener }
