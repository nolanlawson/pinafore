import { store } from '../_store/store'

export function toggleContentWarningShown (realm) {
  let shown = store.getComposeData(realm, 'contentWarningShown')
  store.setComposeData(realm, {contentWarningShown: !shown})
}
