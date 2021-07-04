import { RealmStore } from '../../_utils/RealmStore.js'
import { PAGE_HISTORY_SIZE } from '../../_static/pages.js'

class ListStore extends RealmStore {
  constructor (state) {
    super(state, /* maxSize */ PAGE_HISTORY_SIZE)
  }
}

const listStore = new ListStore()

listStore.computeForRealm('intersectionStates', {})

if (process.browser) {
  window.__listStore = listStore // for debugging
}

export { listStore }
