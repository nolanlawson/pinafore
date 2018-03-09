import { observers } from './observers/observers'
import { computations } from './computations/computations'
import { mixins } from './mixins/mixins'
import { LocalStorageStore } from './LocalStorageStore'

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
  'pinnedPages',
  'composeData'
])

class PinaforeStore extends LocalStorageStore {
  constructor (state) {
    super(state, KEYS_TO_STORE_IN_LOCAL_STORAGE)
  }
}

export const store = new PinaforeStore({
  instanceNameInSearch: '',
  queryInSearch: '',
  currentInstance: null,
  loggedInInstances: {},
  loggedInInstancesInOrder: [],
  instanceThemes: {},
  spoilersShown: {},
  sensitivesShown: {},
  autoplayGifs: false,
  markMediaAsSensitive: false,
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
