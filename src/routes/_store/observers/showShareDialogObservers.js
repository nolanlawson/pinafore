import { store } from '../store'
import { showShareDialogIfNecessary } from '../../_actions/showShareDialogIfNecessary'

// If the user is logged in, and if the Service Worker handled a POST and set special data
// in IndexedDB, then we want to handle it on the home page.
export function showShareDialogObservers () {
  let observedOnce = false
  store.observe('currentVerifyCredentials', verifyCredentials => {
    if (verifyCredentials && !observedOnce) {
      // when the verifyCredentials object is available, we can check to see
      // if the user is trying to share something, then share it
      observedOnce = true
      const { currentPage } = store.get()
      if (currentPage === 'home') {
        /* no await */ showShareDialogIfNecessary()
      }
    }
  })
}
