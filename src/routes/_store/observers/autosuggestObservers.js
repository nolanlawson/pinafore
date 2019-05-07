import { store } from '../store'
import { doEmojiSearch } from '../../_actions/autosuggestEmojiSearch'
import { doAccountSearch } from '../../_actions/autosuggestAccountSearch'

export function autosuggestObservers () {
  let lastSearch

  store.observe('autosuggestSearchText', async autosuggestSearchText => {
    // cancel any inflight XHRs or other operations
    if (lastSearch) {
      lastSearch.cancel()
      lastSearch = null
    }
    // autosuggestSelecting indicates that the user has pressed Enter or clicked on an item
    // and the results are being processed. Returning early avoids a flash of searched content.
    let { composeFocused } = store.get()
    let autosuggestSelecting = store.getForCurrentAutosuggest('autosuggestSelecting')
    if (!composeFocused || !autosuggestSearchText || autosuggestSelecting) {
      return
    }

    let autosuggestType = autosuggestSearchText.startsWith('@') ? 'account' : 'emoji'

    if (autosuggestType === 'emoji') {
      lastSearch = doEmojiSearch(autosuggestSearchText)
    } else {
      lastSearch = doAccountSearch(autosuggestSearchText)
    }
  })
}
