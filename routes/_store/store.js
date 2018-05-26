import { observers } from './observers/observers'
import { computations } from './computations/computations'
import { mixins } from './mixins/mixins'
import { LocalStorageStore } from './LocalStorageStore'
import { observe } from 'svelte-extras'

const KEYS_TO_STORE_IN_LOCAL_STORAGE = new Set([
  'currentInstance',
  'currentRegisteredInstance',
  'currentRegisteredInstanceName',
  'instanceNameInSearch',
  'instanceThemes',
  'loggedInInstances',
  'loggedInInstancesInOrder',
  'autoplayGifs',
  'markMediaAsSensitive',
  'reduceMotion',
  'pinnedPages',
  'composeData'
])

class PinaforeStore extends LocalStorageStore {
  constructor (state) {
    super(state, KEYS_TO_STORE_IN_LOCAL_STORAGE)
  }
}

PinaforeStore.prototype.observe = observe

export const store = new PinaforeStore({
  instanceNameInSearch: '',
  queryInSearch: '',
  currentInstance: null,
  loggedInInstances: {},
  loggedInInstancesInOrder: [],
  instanceThemes: {},
  spoilersShown: {},
  sensitivesShown: {},
  repliesShown: {},
  autoplayGifs: false,
  markMediaAsSensitive: false,
  reduceMotion: false,
  pinnedPages: {},
  instanceLists: {},
  pinnedStatuses: {},
  instanceInfos: {},
  statusModifications: {},
  customEmoji: {},
  composeData: {},
  verifyCredentials: {},
  online: !process.browser || navigator.onLine
})

mixins(PinaforeStore)
computations(store)
observers(store)

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.store = store // for debugging
}

// needed for tests
if (process.browser) {
  window.__forceOnline = online => store.set({online})
}
