import debounce from 'lodash/debounce'
import { toast } from './toast'

const OFFLINE_DELAY = 1000

const notifyOffline = debounce(() => {
  toast.say('You seem to be offline. You can still read toots while offline.')
}, OFFLINE_DELAY)

let oldTheme
let meta = process.browser && document.querySelector('meta[name="theme-color"]')

const observe = online => {
  if (!localStorage.store_currentInstance) {
    return // only show notification for logged-in users
  }
  document.body.classList.toggle('offline', !online)
  if (online) {
    meta.content = oldTheme || window.__themeColors['default']
  } else {
    let offlineThemeColor = window.__themeColors.offline
    if (meta.content !== offlineThemeColor) { oldTheme = meta.content }
    meta.content = offlineThemeColor
    notifyOffline()
  }
}

if (!navigator.onLine) {
  observe(false)
}

window.addEventListener('offline', () => observe(false))
window.addEventListener('online', () => observe(true))
