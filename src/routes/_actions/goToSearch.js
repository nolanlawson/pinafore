import { store } from '../_store/store.js'
import { goto } from '../../../__sapper__/client.js'
import { emit } from '../_utils/eventBus.js'

// Go to the search page, and also focus the search input. For accessibility
// and usability reasons, this only happens on pressing these particular hotkeys.
export async function goToSearch () {
  if (store.get().currentPage === 'search') {
    emit('focusSearchInput')
  } else {
    store.set({ focusSearchInput: true })
    goto('/search')
  }
}
