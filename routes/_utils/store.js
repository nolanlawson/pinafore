import { Store } from 'svelte/store.js'

const key = 'ui-store'

class LocalStorageStore extends Store {
  constructor(state) {
    super(state)
    if (process.browser) {
      let cached = localStorage.getItem(key)
      if (cached) {
        this.set(JSON.parse(cached))
      }
    }
  }

  save() {
    if (process.browser) {
      localStorage.setItem(key, JSON.stringify(this._state))
    }
  }
}

const store = new LocalStorageStore({
  instanceNameInSearch: ''
})

if (process.browser) {
  window.store = store
}

export { store }