import { store } from '../store'
import { doEmojiSearch } from '../../_actions/autosuggestEmojiSearch'
import { doAccountSearch } from '../../_actions/autosuggestAccountSearch'

export function autosuggestObservers () {
  let lastSearch

  store.observe('autosuggestSearchText', async autosuggestSearchText => {
    let { composeFocused } = store.get()
    if (!composeFocused || !autosuggestSearchText) {
      return
    }
    /* autosuggestSelecting indicates that the user has pressed Enter or clicked on an item
       and the results are being processed. Returning early avoids a flash of searched content.
       We can also cancel any inflight XHRs here.
     */
    let autosuggestSelecting = store.getForCurrentAutosuggest('autosuggestSelecting')
    if (autosuggestSelecting) {
      if (lastSearch) {
        lastSearch.cancel()
        lastSearch = null
      }
      return
    }

    let autosuggestType = autosuggestSearchText.startsWith('@') ? 'account' : 'emoji'

    if (lastSearch) {
      lastSearch.cancel()
    }

    if (autosuggestType === 'emoji') {
      lastSearch = doEmojiSearch(autosuggestSearchText)
    } else {
      lastSearch = doAccountSearch(autosuggestSearchText)
    }
  })
}
