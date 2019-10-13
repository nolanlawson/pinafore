import { database } from '../_database/database'
import { store } from '../_store/store'
import { search } from '../_api/search'
import { SEARCH_RESULTS_LIMIT } from '../_static/autosuggest'
import { concat } from '../_utils/arrays'
import uniqBy from 'lodash-es/uniqBy'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { RequestThrottler } from '../_utils/RequestThrottler'

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
  const requestThrottler = new RequestThrottler(searchAccountsRemotely, onNewRemoteResults)

  async function searchAccountsLocally (searchText) {
    localResults = await database.searchAccountsByUsername(
      currentInstance, searchText.substring(1), DATABASE_SEARCH_RESULTS_LIMIT)
  }

  async function searchAccountsRemotely (signal) {
    return (await search(
      currentInstance, accessToken, searchText, false, SEARCH_RESULTS_LIMIT, signal
    )).accounts
  }

  function onNewRemoteResults (results) {
    remoteResults = results
    onNewResults()
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

  scheduleIdleTask(() => {
    if (canceled) {
      return
    }
    // run the two searches in parallel
    searchAccountsLocally(searchText).then(onNewResults)
    requestThrottler.request()
  })

  return {
    cancel: () => {
      canceled = true
      requestThrottler.cancel()
    }
  }
}
