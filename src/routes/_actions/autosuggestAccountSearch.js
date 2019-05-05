import { database } from '../_database/database'
import { store } from '../_store/store'
import { search } from '../_api/search'
import { SEARCH_RESULTS_LIMIT } from '../_static/autosuggest'
import { USERNAME_LOWERCASE } from '../_database/constants'
import { concat } from '../_utils/arrays'
import uniqBy from 'lodash-es/uniqBy'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'

const DATABASE_SEARCH_RESULTS_LIMIT = 30

function byAccountRelevance (a, b) {
  // accounts you're following go first
  if (a.following !== b.following) {
    return a.following ? -1 : 1
  }
  // after that, just sort by username
  if (a[USERNAME_LOWERCASE] !== b[USERNAME_LOWERCASE]) {
    return a[USERNAME_LOWERCASE] < b[USERNAME_LOWERCASE] ? -1 : 1
  }
  return 0
}

function byAccountId (a) {
  return a.id
}

export function doAccountSearch (searchText) {
  let canceled = false
  let localResults
  let remoteResults
  let { currentInstance, accessToken } = store.get()

  async function searchAccountsLocally (searchText) {
    localResults = await database.searchAccountsByUsername(
      currentInstance, searchText.substring(1), DATABASE_SEARCH_RESULTS_LIMIT)
  }

  async function searchAccountsRemotely (searchText) {
    remoteResults = (await search(currentInstance, accessToken, searchText, false, SEARCH_RESULTS_LIMIT)).accounts
  }

  function mergeAndTruncateResults () {
    return uniqBy(concat(localResults || [], remoteResults || []), byAccountId)
      .sort(byAccountRelevance)
      .slice(0, SEARCH_RESULTS_LIMIT)
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
    }
  }
}
