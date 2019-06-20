import { observers } from './observers/observers'
import { computations } from './computations/computations'
import { mixins } from './mixins/mixins'
import { LocalStorageStore } from './LocalStorageStore'
import { observe } from 'svelte-extras'

const persistedState = {
  autoplayGifs: false,
  composeData: {},
  currentInstance: null,
  currentRegisteredInstanceName: undefined,
  currentRegisteredInstance: undefined,
  // we disable scrollbars by default on iOS
  disableCustomScrollbars: process.browser && /iP(?:hone|ad|od)/.test(navigator.userAgent),
  disableFavCounts: false,
  disableFollowerCounts: false,
  disableHotkeys: false,
  disableInfiniteScroll: false,
  disableLongAriaLabels: false,
  disableNotificationBadge: false,
  disableReblogCounts: false,
  disableTapOnStatus: false,
  enableGrayscale: false,
  hideCards: false,
  largeInlineMedia: false,
  instanceNameInSearch: '',
  instanceThemes: {},
  instanceSettings: {},
  loggedInInstances: {},
  loggedInInstancesInOrder: [],
  markMediaAsSensitive: false,
  neverMarkMediaAsSensitive: false,
  omitEmojiInDisplayNames: undefined,
  pinnedPages: {},
  pushSubscriptions: {},
  reduceMotion:
    !process.browser ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  underlineLinks: false
}

const nonPersistedState = {
  customEmoji: {},
  instanceInfos: {},
  instanceLists: {},
  online: !process.browser || navigator.onLine,
  pinnedStatuses: {},
  polls: {},
  pushNotificationsSupport:
    process.browser &&
    ('serviceWorker' in navigator &&
      'PushManager' in window &&
      'getKey' in window.PushSubscription.prototype),
  queryInSearch: '',
  repliesShown: {},
  sensitivesShown: {},
  spoilersShown: {},
  statusModifications: {},
  verifyCredentials: {},
  openShareDialog: false
}

const state = Object.assign({}, persistedState, nonPersistedState)
const keysToStoreInLocalStorage = new Set(Object.keys(persistedState))

class PinaforeStore extends LocalStorageStore {
  constructor (state) {
    super(state, keysToStoreInLocalStorage)
  }
}

PinaforeStore.prototype.observe = observe

export const store = new PinaforeStore(state)

mixins(PinaforeStore)
computations(store)
observers(store)

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.store = store // for debugging
}

// needed for tests
if (process.browser) {
  window.__forceOnline = online => store.set({ online })
}
