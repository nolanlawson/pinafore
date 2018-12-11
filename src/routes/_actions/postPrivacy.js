
import { store } from '../_store/store'

export function setPostPrivacy (realm, postPrivacyKey) {
  store.setComposeData(realm, { postPrivacy: postPrivacyKey })
}
