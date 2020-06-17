import { store } from '../_store/store'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import * as emojiDatabase from '../_utils/emojiDatabase'
import { SEARCH_RESULTS_LIMIT } from '../_static/autosuggest'

async function searchEmoji (searchText) {
  const results = await emojiDatabase.findBySearchQuery(searchText.substring(1))
  return results.slice(0, SEARCH_RESULTS_LIMIT)
}

export function doEmojiSearch (searchText) {
  let canceled = false

  scheduleIdleTask(async () => {
    if (canceled) {
      return
    }
    const results = await searchEmoji(searchText)
    if (canceled) {
      return
    }
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
