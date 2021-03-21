import { store } from '../store'
import { showComposeDialog } from '../../_actions/showComposeDialog'

// If the user is logged in, and if the Service Worker handled a POST and set special data
// in IndexedDB, then we want to handle it on the home page.
export function showComposeDialogObservers () {
  let observedOnce = false
  store.observe('currentVerifyCredentials', async verifyCredentials => {
    if (verifyCredentials && !observedOnce) {
      // when the verifyCredentials object is available, we can check to see
      // if the user is trying to share something (or we got here from a shortcut), then share it
      observedOnce = true
      const { currentPage } = store.get()
      if (currentPage === 'home' && new URLSearchParams(location.search).get('compose') === 'true') {
        await showComposeDialog()
      }
    }
  })
}
