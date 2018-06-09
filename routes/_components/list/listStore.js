import { RealmStore } from '../../_utils/RealmStore'

class ListStore extends RealmStore {
  constructor (state) {
    super(state, /* maxSize */ 10)
  }
}

const listStore = new ListStore()

listStore.computeForRealm('intersectionStates', {})

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.listStore = listStore
}

export { listStore }
