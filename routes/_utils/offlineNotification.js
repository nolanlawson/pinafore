import debounce from 'lodash/debounce'
import { toast } from './toast'

const OFFLINE_DELAY = 1000

const notifyOffline = debounce(() => {
  toast.say('You appear to be offline. You can still read toots while offline.')
}, OFFLINE_DELAY)

const observe = online => {
  if (!localStorage.store_currentInstance) {
    return // only show notification for logged-in users
  }
  document.body.classList.toggle('offline', !online)
  if (!online) {
    notifyOffline()
  }
}

window.addEventListener('offline', () => observe(false));
window.addEventListener('online', () => observe(true));