import { RealmStore } from '../../_utils/RealmStore'
import { observe } from 'svelte-extras'

class PseudoVirtualListStore extends RealmStore {
  constructor (state) {
    super(state, /* maxSize */ 10)
  }
}

PseudoVirtualListStore.prototype.observe = observe

const pseudoVirtualListStore = new PseudoVirtualListStore()

pseudoVirtualListStore.computeForRealm('intersectionStates', {})

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.pseudoVirtualListStore = pseudoVirtualListStore
}

export { pseudoVirtualListStore }
