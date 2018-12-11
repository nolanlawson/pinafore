import { store } from '../_store/store'

export function toggleContentWarningShown (realm) {
  let shown = store.getComposeData(realm, 'contentWarningShown')
  let contentWarning = store.getComposeData(realm, 'contentWarning')
  let newShown = !shown
  store.setComposeData(realm, {
    contentWarning: newShown ? contentWarning : '',
    contentWarningShown: newShown
  })
}
