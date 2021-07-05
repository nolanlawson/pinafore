import { onUserIsLoggedOut } from '../../_actions/onUserIsLoggedOut.js'

export function logOutObservers (store) {
  if (!process.browser) {
    return
  }
  store.observe('isUserLoggedIn', isUserLoggedIn => {
    if (!isUserLoggedIn) {
      onUserIsLoggedOut()
    }
  })
}
