import { Store } from 'svelte/store.js'

const LS = process.browser && localStorage
class LocalStorageStore extends Store {

  constructor(state) {
    super(state)
    if (process.browser) {
      this.lastChanged = {}
      let newState = {}
      for (let i = 0, len = LS.length; i < len; i++) {
        let key = LS.key(i)
        if (key.startsWith('store_')) {
          let item = LS.getItem(key)
          newState[key.substring(6)] = item === 'undefined' ? undefined : JSON.parse(item)
        }
      }
      this.set(newState)
      this.onchange((state, changed) => {
        Object.keys(changed).forEach(change => {
          if (!this._computed[change]) { // TODO: better way to ignore computed values?
            this.lastChanged[change] = true
          }
        })
      })
    }
  }

  save() {
    if (process.browser) {
      Object.keys(this.lastChanged).forEach(key => {
        LS.setItem(`store_${key}`, JSON.stringify(this.get(key)))
      })
      this.lastChanged = {}
    }
  }
}

const store = new LocalStorageStore({
  instanceNameInSearch: '',
  currentRegisteredInstance: null,
  currentRegisteredInstanceName: '',
  currentInstance: null,
  loggedInInstances: {},
  loggedInInstancesInOrder: [],
  instanceThemes: {}
})

store.compute(
  'isUserLoggedIn',
  ['currentInstance', 'loggedInInstances'],
  (currentInstance, loggedInInstances) => !!(currentInstance && Object.keys(loggedInInstances).includes(currentInstance))
)

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.store = store // for debugging
}

export { store }