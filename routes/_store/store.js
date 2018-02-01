import { observers } from './obsevers'
import { computations } from './computations'
import { mixins } from './mixins'
import { LocalStorageStore } from './LocalStorageStore'

const KEYS_TO_STORE_IN_LOCAL_STORAGE = new Set([
  "currentInstance",
  "currentRegisteredInstance",
  "currentRegisteredInstanceName",
  "instanceNameInSearch",
  "instanceThemes",
  "loggedInInstances",
  "loggedInInstancesInOrder",
  "autoplayGifs"
])

class PinaforeStore extends LocalStorageStore {
  constructor(state) {
    super(state, KEYS_TO_STORE_IN_LOCAL_STORAGE)
  }
}

const store = new PinaforeStore({
  instanceNameInSearch: '',
  currentInstance: null,
  loggedInInstances: {},
  loggedInInstancesInOrder: [],
  instanceThemes: {},
  autoplayGifs: false
})

mixins(PinaforeStore)
computations(store)
observers(store)

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.store = store // for debugging
}

export { store }