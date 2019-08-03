import { store } from '../_store/store'

export function toggleContentWarningShown (realm) {
  const shown = store.getComposeData(realm, 'contentWarningShown')
  const contentWarning = store.getComposeData(realm, 'contentWarning')
  const newShown = !shown
  store.setComposeData(realm, {
    contentWarning: newShown ? contentWarning : '',
    contentWarningShown: newShown
  })
}
