import { search } from '../_api/search'
import { store } from '../_store/store'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { SEARCH_RESULTS_LIMIT } from '../_static/autosuggest'
import { RequestThrottler } from '../_utils/RequestThrottler'
import { sum } from '../_utils/lodash-lite'

const HASHTAG_SEARCH_LIMIT = 10

function getUses (historyItem) {
  return historyItem.uses
}

// Show the most common hashtags first, then sort by name
function byUsesThenName (a, b) {
  if (a.history && b.history && a.history.length && b.history.length) {
    const aCount = sum(a.history.map(getUses))
    const bCount = sum(b.history.map(getUses))
    return aCount > bCount ? -1 : aCount < bCount ? 1 : 0
  }
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
}

export function doHashtagSearch (searchText) {
  const { currentInstance, accessToken } = store.get()
  const requestThrottler = new RequestThrottler(searchHashtags)

  async function searchHashtags (signal) {
    const results = await search(
      currentInstance, accessToken, searchText, false, HASHTAG_SEARCH_LIMIT, true, signal
    )
    return results.hashtags.sort(byUsesThenName).slice(0, SEARCH_RESULTS_LIMIT)
  }

  scheduleIdleTask(async () => {
    try {
      const results = await requestThrottler.request()
      store.setForCurrentAutosuggest({
        autosuggestType: 'hashtag',
        autosuggestSelected: 0,
        autosuggestSearchResults: results
      })
    } catch (err) {
      console.warn('ignored autosuggest error', err)
    }
  })

  return {
    cancel: () => {
      requestThrottler.cancel()
    }
  }
}
