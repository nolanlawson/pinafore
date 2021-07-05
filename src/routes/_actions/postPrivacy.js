
import { store } from '../_store/store.js'

export function setPostPrivacy (realm, postPrivacyKey) {
  store.setComposeData(realm, { postPrivacy: postPrivacyKey })
}
