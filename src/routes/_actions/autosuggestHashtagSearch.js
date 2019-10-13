import { search } from '../_api/search'
import { store } from '../_store/store'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { SEARCH_RESULTS_LIMIT } from '../_static/autosuggest'
import { RequestThrottler } from '../_utils/RequestThrottler'

export function doHashtagSearch (searchText) {
  const { currentInstance, accessToken } = store.get()
  const requestThrottler = new RequestThrottler(searchHashtagsRemotely, onNewResults)

  async function searchHashtagsRemotely (signal) {
    return (await search(
      currentInstance, accessToken, searchText, false, SEARCH_RESULTS_LIMIT, signal
    )).hashtags
  }

  function onNewResults (results) {
    store.setForCurrentAutosuggest({
      autosuggestType: 'hashtag',
      autosuggestSelected: 0,
      autosuggestSearchResults: results
    })
  }

  scheduleIdleTask(() => {
    requestThrottler.request()
  })

  return {
    cancel: () => {
      requestThrottler.cancel()
    }
  }
}
