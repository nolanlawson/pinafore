import { store } from '../_store/store.js'

export function toggleContentWarningShown (realm) {
  const shown = store.getComposeData(realm, 'contentWarningShown')
  const contentWarning = store.getComposeData(realm, 'contentWarning')
  const newShown = !shown
  store.setComposeData(realm, {
    contentWarning: newShown ? contentWarning : '',
    contentWarningShown: newShown,
    sensitive: contentWarning && newShown // toggling content warning automatically toggles sensitive media
  })
}
