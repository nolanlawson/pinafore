import { Store } from 'svelte/store'

const LS = process.browser && localStorage

function safeParse (str) {
  return !str ? undefined : (str === 'undefined' ? undefined : JSON.parse(str))
}

export class LocalStorageStore extends Store {
  constructor (state, keysToWatch) {
    super(state)
    if (!process.browser) {
      return
    }
    this._keysToWatch = keysToWatch
    this._keysToSave = {}
    let newState = {}
    for (let i = 0, len = LS.length; i < len; i++) {
      let key = LS.key(i)
      if (key.startsWith('store_')) {
        let item = LS.getItem(key)
        newState[key.substring(6)] = safeParse(item)
      }
    }
    this.set(newState)
    this.on('state', ({changed}) => {
      Object.keys(changed).forEach(change => {
        if (this._keysToWatch.has(change)) {
          this._keysToSave[change] = true
        }
      })
    })
    if (process.browser) {
      window.addEventListener('beforeunload', () => this.save())
    }
  }

  save () {
    if (!process.browser) {
      return
    }
    Object.keys(this._keysToSave).forEach(key => {
      LS.setItem(`store_${key}`, JSON.stringify(this.get(key)))
    })
    this._keysToSave = {}
  }
}
