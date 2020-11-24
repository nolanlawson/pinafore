import { set, keys, del } from '../_thirdparty/idb-keyval/idb-keyval'

const PREFIX = 'known-instance-'

export async function getKnownInstances () {
  return (await keys())
    .filter(_ => _.startsWith(PREFIX))
    .map(_ => _.substring(PREFIX.length))
}

export async function addKnownInstance (instanceName) {
  return set(PREFIX + instanceName, true)
}

export async function deleteKnownInstance (instanceName) {
  return del(PREFIX + instanceName)
}
