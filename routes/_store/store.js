import { observers } from './observers'
import { computations } from './computations'
import { mixins } from './mixins'
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
  'composeText',
  'uploadedMedia',
  'postPrivacy'
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
  composeText: {},
  rawComposeText: '',
  customEmoji: {},
  uploadedMedia: {},
  postPrivacy: {},
  verifyCredentials: {}
})

mixins(PinaforeStore)
computations(store)
observers(store)

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.store = store // for debugging
}
