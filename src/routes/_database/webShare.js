import { get, set, close, del } from '../_thirdparty/idb-keyval/idb-keyval'
import { WEB_SHARE_TARGET_DATA_IDB_KEY } from '../_static/share'

export function deleteWebShareData () {
  return del(WEB_SHARE_TARGET_DATA_IDB_KEY)
}

export function setWebShareData (data) {
  return set(WEB_SHARE_TARGET_DATA_IDB_KEY, data)
}

export function getWebShareData () {
  return get(WEB_SHARE_TARGET_DATA_IDB_KEY)
}

export function closeKeyValIDBConnection () {
  return close()
}
