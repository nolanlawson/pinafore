import { RealmStore } from '../../_utils/RealmStore'

class PseudoVirtualListStore extends RealmStore {
  constructor(state) {
    super(state, /* maxSize */ 10)
  }
}

const pseudoVirtualListStore = new PseudoVirtualListStore()

pseudoVirtualListStore.computeForRealm('intersectionStates', {})

if (process.browser && process.env.NODE_NODE !== 'production') {
  window.pseudoVirtualListStore = pseudoVirtualListStore
}

export { pseudoVirtualListStore }