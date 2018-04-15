import debounce from 'lodash-es/debounce'
import { toast } from '../../_utils/toast'

const OFFLINE_DELAY = 5000
const NOTIFY_OFFLINE_LIMIT = 1

let notifyCount = 0

// debounce to avoid notifying for a short connection issue
const notifyOffline = debounce(() => {
  if (process.browser && !navigator.onLine && ++notifyCount <= NOTIFY_OFFLINE_LIMIT) {
    toast.say('You seem to be offline. You can still read toots while offline.')
  }
}, OFFLINE_DELAY)

export function onlineObservers (store) {
  if (!process.browser) {
    return
  }
  let meta = document.getElementById('theThemeColor')
  let oldTheme = meta.content

  store.observe('online', online => {
    document.body.classList.toggle('offline', !online)
    if (online) {
      meta.content = oldTheme
    } else {
      let offlineThemeColor = window.__themeColors.offline
      if (meta.content !== offlineThemeColor) {
        oldTheme = meta.content
      }
      meta.content = offlineThemeColor
      notifyOffline()
    }
  })

  window.addEventListener('offline', () => store.set({online: false}))
  window.addEventListener('online', () => store.set({online: true}))
}
