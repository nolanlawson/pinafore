// A store where you can divide data into "realms" that are backed with an LRU cache.
// Each realm has self-contained data that you can set with setForRealm() and compute
// with computeForRealm(). The maxSize determines how many realms to keep in the LRU cache.
import { Store } from 'svelte/store.js'
import QuickLRU from 'quick-lru'
import { mark, stop } from './marks'

export class RealmStore extends Store {
  constructor(init, maxSize) {
    super(init)
    this.set({realms: new QuickLRU({maxSize: maxSize})})
    this._batches = {}
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

  /*
   * Update several values at once in a realm, assuming the key points
   * to a plain old javascript object.
   */
  batchUpdateForRealm(key, subKey, value) {
    let realm = this.get('currentRealm')
    let realmBatches = this._batches[realm]
    if (!realmBatches) {
      realmBatches = this._batches[realm] = {}
    }
    let batch = realmBatches[key]
    if (!batch) {
      batch = realmBatches[key] = {}
    }
    batch[subKey] = value

    requestAnimationFrame(() => {
      let batch = this._batches[realm] && this._batches[realm][key]
      if (!batch) {
        return
      }
      let updatedKeys = Object.keys(batch)
      if (!updatedKeys.length) {
        return
      }
      mark('batchUpdate')
      let obj = this.get(key)
      for (let otherKey of updatedKeys) {
        obj[otherKey] = batch[otherKey]
      }
      delete this._batches[realm][key]
      let realms = this.get('realms')
      realms.set(realm, Object.assign(realms.get(realm) || {}, {[key]: obj}))
      this.set({realms: realms})
      stop('batchUpdate')
    })
  }
}