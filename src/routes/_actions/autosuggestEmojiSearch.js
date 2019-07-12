import { store } from '../_store/store'
import { SEARCH_RESULTS_LIMIT } from '../_static/autosuggest'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'

function searchEmoji (searchText) {
  searchText = searchText.toLowerCase().substring(1)
  const { currentCustomEmoji } = store.get()
  const results = currentCustomEmoji.filter(emoji => emoji.shortcode.toLowerCase().startsWith(searchText))
    .sort((a, b) => a.shortcode.toLowerCase() < b.shortcode.toLowerCase() ? -1 : 1)
    .slice(0, SEARCH_RESULTS_LIMIT)
  return results
}

export function doEmojiSearch (searchText) {
  let canceled = false

  scheduleIdleTask(() => {
    if (canceled) {
      return
    }
    const results = searchEmoji(searchText)
    store.setForCurrentAutosuggest({
      autosuggestType: 'emoji',
      autosuggestSelected: 0,
      autosuggestSearchResults: results
    })
  })

  return {
    cancel: () => {
      canceled = true
    }
  }
}
