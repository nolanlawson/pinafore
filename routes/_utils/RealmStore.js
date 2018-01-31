// A store where you can divide data into "realms" that are backed with an LRU cache.
// Each realm has self-contained data that you can set with setForRealm() and compute
// with computeForRealm(). The maxSize determines how many realms to keep in the LRU cache.
import { Store } from 'svelte/store.js'
import QuickLRU from 'quick-lru'

export class RealmStore extends Store {
  constructor(init, maxSize) {
    super(init)
    this.set({realms: new QuickLRU({maxSize: maxSize})})
  }

  setCurrentRealm(realm) {
    this.set({currentRealm: realm})
  }

  setForRealm(obj) {
    let realmName = this.get('currentRealm')
    let realms = this.get('realms')
    realms.set(realmName, Object.assign(realms.get(realmName) || {}, obj))
    this.set({realms: realms})
  }

  computeForRealm(key, defaultValue) {
    this.compute(key,
        ['realms', 'currentRealm'],
        (realms, currentRealm) => {
      let realmData = realms.get(currentRealm)
      return (realmData && realmData[key]) || defaultValue
    })
  }
}