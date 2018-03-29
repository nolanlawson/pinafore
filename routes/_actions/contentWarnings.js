import { store } from '../_store/store'

export function toggleContentWarningShown (realm) {
  let shown = store.getComposeData(realm, 'contentWarningShown')
  let contentWarning = store.getComposeData(realm, 'contentWarning')
  store.setComposeData(realm, {
    contentWarning: shown ? contentWarning : '',
    contentWarningShown: !shown
  })
}
