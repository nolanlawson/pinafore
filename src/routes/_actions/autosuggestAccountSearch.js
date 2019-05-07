import { database } from '../_database/database'
import { store } from '../_store/store'
import { search } from '../_api/search'
import { SEARCH_RESULTS_LIMIT } from '../_static/autosuggest'
import { concat } from '../_utils/arrays'
import uniqBy from 'lodash-es/uniqBy'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { PromiseThrottler } from '../_utils/PromiseThrottler'

const DATABASE_SEARCH_RESULTS_LIMIT = 30
const promiseThrottler = new PromiseThrottler(200) // Mastodon FE also uses 200ms

function byUsername (a, b) {
  let usernameA = a.acct.toLowerCase()
  let usernameB = b.acct.toLowerCase()

  return usernameA < usernameB ? -1 : usernameA === usernameB ? 0 : 1
}

function byAccountId (a) {
  return a.id
}

export function doAccountSearch (searchText) {
  let canceled = false
  let localResults
  let remoteResults
  let { currentInstance, accessToken } = store.get()
  let controller = typeof AbortController === 'function' && new AbortController()

  function abortFetch () {
    if (controller) {
      controller.abort()
      controller = null
    }
  }

  async function searchAccountsLocally (searchText) {
    localResults = await database.searchAccountsByUsername(
      currentInstance, searchText.substring(1), DATABASE_SEARCH_RESULTS_LIMIT)
  }

  async function searchAccountsRemotely (searchText) {
    // Throttle our XHRs to be a good citizen and not spam the server with one XHR per keystroke
    await promiseThrottler.next()
    if (canceled) {
      return
    }
    remoteResults = (await search(
      currentInstance, accessToken, searchText, false, SEARCH_RESULTS_LIMIT, controller && controller.signal
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
      let topRemoteResults = (remoteResults || [])
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
    let results = mergeAndTruncateResults()
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
    searchAccountsLocally(searchText).then(onNewResults).catch(err => {
      console.error('could not search locally', err)
    })
    searchAccountsRemotely(searchText).then(onNewResults).catch(err => {
      console.error('could not search remotely', err)
    })
  })

  return {
    cancel: () => {
      canceled = true
      abortFetch()
    }
  }
}
