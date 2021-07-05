import { safeLocalStorage as LS } from '../_utils/safeLocalStorage.js'
import { lifecycle } from '../_utils/lifecycle.js'
import { safeParse } from '../_utils/safeParse.js'
import * as storePackage from 'svelte/store.umd.js'

const { Store } = storePackage

export class LocalStorageStore extends Store {
  constructor (state, keysToWatch) {
    super(state)
    if (!process.browser) {
      return
    }
    this._keysToWatch = keysToWatch
    this._keysToSave = {}
    const newState = {}
    for (let i = 0, len = LS.length; i < len; i++) {
      const key = LS.key(i)
      if (key.startsWith('store_')) {
        const item = LS.getItem(key)
        newState[key.substring(6)] = safeParse(item)
      }
    }
    this.set(newState)
    this.on('state', ({ changed }) => {
      Object.keys(changed).forEach(change => {
        if (this._keysToWatch.has(change)) {
          this._keysToSave[change] = true
        }
      })
    })
    if (process.browser) {
      lifecycle.addEventListener('statechange', e => {
        if (e.newState === 'passive') {
          console.log('saving LocalStorageStore...')
          this.save()
        }
      })
    }
  }

  save () {
    if (!process.browser) {
      return
    }
    Object.keys(this._keysToSave).forEach(key => {
      LS.setItem(`store_${key}`, JSON.stringify(this.get()[key]))
    })
    this._keysToSave = {}
  }
}
