import debounce from 'lodash/debounce'
import { toast } from './toast'

const OFFLINE_DELAY = 1000

const notifyOffline = debounce(() => {
  toast.say('You seem to be offline. You can still read toots while offline.')
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

if (!navigator.onLine) {
  observe(false)
}

window.addEventListener('offline', () => observe(false));
window.addEventListener('online', () => observe(true));