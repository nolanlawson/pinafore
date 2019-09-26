import { importLoggedInStoreExtensions } from '../../_utils/asyncModules'

// An observer that calls an observer... this is a bit weird, but it eliminates
// circular dependencies and also allows us to lazy load observers/computations
// that are only needed when you're logged in.
export function setupLoggedInObservers (store) {
  store.observe('isUserLoggedIn', isUserLoggedIn => {
    if (isUserLoggedIn) {
      importLoggedInStoreExtensions()
    }
  })
}
