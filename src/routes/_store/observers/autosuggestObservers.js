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
