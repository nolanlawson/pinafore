import { onUserIsLoggedOut } from '../../_actions/onUserIsLoggedOut'

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
