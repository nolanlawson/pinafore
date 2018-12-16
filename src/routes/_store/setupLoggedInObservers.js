import { store } from './store'
import { importLoggedInObservers } from '../_utils/asyncModules'

let observedOnce = false

// An observer that calls an observer... this is a bit weird, but it eliminates
// circular dependencies and also allows us to lazy load observers that are
// only needed when you're logged in.
store.observe('isUserLoggedIn', isUserLoggedIn => {
  if (isUserLoggedIn && !observedOnce) {
    importLoggedInObservers().then(loggedInObservers => loggedInObservers())
    observedOnce = true
  }
})
