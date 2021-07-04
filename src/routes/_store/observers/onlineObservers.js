import { debounce } from '../../_thirdparty/lodash/timers.js'
import { toast } from '../../_components/toast/toast.js'

const OFFLINE_DELAY = 5000
const NOTIFY_OFFLINE_LIMIT = 1

let notifyCount = 0

// debounce to avoid notifying for a short connection issue
const notifyOffline = debounce(() => {
  if (process.browser && !navigator.onLine && ++notifyCount <= NOTIFY_OFFLINE_LIMIT) {
    toast.say('intl.youAreOffline')
  }
}, OFFLINE_DELAY)

export function onlineObservers (store) {
  if (!process.browser) {
    return
  }

  store.observe('online', online => {
    if (!online) {
      notifyOffline()
    }
  })

  window.addEventListener('offline', () => store.set({ online: false }))
  window.addEventListener('online', () => store.set({ online: true }))
}
