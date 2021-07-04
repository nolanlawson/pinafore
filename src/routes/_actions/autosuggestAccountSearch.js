import { database } from '../_database/database.js'
import { store } from '../_store/store.js'
import { search } from '../_api/search.js'
import { SEARCH_RESULTS_LIMIT } from '../_static/autosuggest.js'
import { concat } from '../_utils/arrays.js'
import { uniqBy } from '../_thirdparty/lodash/objects.js'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask.js'
import { RequestThrottler } from '../_utils/RequestThrottler.js'

const DATABASE_SEARCH_RESULTS_LIMIT = 30

function byUsername (a, b) {
  const usernameA = a.acct.toLowerCase()
  const usernameB = b.acct.toLowerCase()

  return usernameA < usernameB ? -1 : usernameA === usernameB ? 0 : 1
}

function byAccountId (a) {
  return a.id
}

export function doAccountSearch (searchText) {
  let canceled = false
  let localResults
  let remoteResults
  const { currentInstance, accessToken } = store.get()
  const requestThrottler = new RequestThrottler(doSearchAccountsRemotely)

  async function searchAccountsLocally () {
    localResults = await database.searchAccountsByUsername(
      currentInstance, searchText.substring(1), DATABASE_SEARCH_RESULTS_LIMIT)
  }

  async function searchAccountsRemotely () {
    remoteResults = await requestThrottler.request()
  }

  async function doSearchAccountsRemotely (signal) {
    return (await search(
      currentInstance, accessToken, searchText, false, SEARCH_RESULTS_LIMIT, false, signal
    )).accounts
  }

  function mergeAndTruncateResults () {
    // Always include local results; they are more likely to be relevant
    // because the user has seen their content before. Otherwise, sort by username.
    let results = (localResults || [])
      .slice()
      .sort(byUsername)
      .slice(0, SEARCH_RESULTS_LIMIT)

    if (results.length < SEARCH_RESULTS_LIMIT) {
      const topRemoteResults = (remoteResults || [])
        .sort(byUsername)
        .slice(0, SEARCH_RESULTS_LIMIT - results.length)
      results = concat(results, topRemoteResults)
      results = uniqBy(results, byAccountId)
    }

    return results
  }

  function onNewResults () {
    if (canceled) {
      return
    }
    const results = mergeAndTruncateResults()
    store.setForCurrentAutosuggest({
      autosuggestType: 'account',
      autosuggestSelected: 0,
      autosuggestSearchResults: results
    })
  }

  function onError (err) {
    console.warn('ignored autosuggest error', err)
  }

  scheduleIdleTask(() => {
    if (canceled) {
      return
    }
    // run the two searches in parallel
    searchAccountsLocally().then(onNewResults).catch(onError)
    searchAccountsRemotely().then(onNewResults).catch(onError)
  })

  return {
    cancel: () => {
      canceled = true
      requestThrottler.cancel()
    }
  }
}
