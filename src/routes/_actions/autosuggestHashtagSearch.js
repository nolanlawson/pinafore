import { search } from '../_api/search'
import { store } from '../_store/store'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { SEARCH_RESULTS_LIMIT } from '../_static/autosuggest'
import { PromiseThrottler } from '../_utils/PromiseThrottler'

const promiseThrottler = new PromiseThrottler(200) // Mastodon FE also uses 200ms

export function doHashtagSearch (searchText) {
  let canceled = false
  const { currentInstance, accessToken } = store.get()
  let controller = typeof AbortController === 'function' && new AbortController()

  function abortFetch () {
    if (controller) {
      controller.abort()
      controller = null
    }
  }

  async function searchHashtagsRemotely (searchText) {
    // Throttle our XHRs to be a good citizen and not spam the server with one XHR per keystroke
    await promiseThrottler.next()
    if (canceled) {
      return
    }
    const searchPromise = search(
      currentInstance, accessToken, searchText, false, SEARCH_RESULTS_LIMIT, controller && controller.signal
    )
    const results = (await searchPromise).hashtags
    store.setForCurrentAutosuggest({
      autosuggestType: 'hashtag',
      autosuggestSelected: 0,
      autosuggestSearchResults: results
    })
  }

  scheduleIdleTask(() => {
    if (canceled) {
      return
    }
    /* no await */ searchHashtagsRemotely(searchText)
  })

  return {
    cancel: () => {
      canceled = true
      abortFetch()
    }
  }
}
