import { set, keys, del, close } from '../_thirdparty/idb-keyval/idb-keyval'
import lifecycle from 'page-lifecycle/dist/lifecycle.mjs'

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

if (process.browser) {
  lifecycle.addEventListener('statechange', async event => {
    if (event.newState === 'frozen') { // page is frozen, close IDB connections
      await close()
      console.log('closed knownInstances DB')
    }
  })
}
