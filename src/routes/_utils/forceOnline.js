import { store } from '../_store/store'
import { emit } from './eventBus'

// Force online/offline state. Needed for integration tests.
// It would be nice not to actually ship this in production, but *shrug*
if (process.browser) {
  const globalFetch = window.fetch

  window.__forceOnline = online => {
    store.set({ online })

    if (online) {
      window.fetch = globalFetch
      emit('forcedOnline', true)
    } else {
      window.fetch = () => Promise.reject(new Error('force offline'))
      emit('forcedOnline', false)
    }
  }
}
