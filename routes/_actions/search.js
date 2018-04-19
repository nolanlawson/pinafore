import { store } from '../_store/store'
import { toast } from '../_utils/toast'
import { search } from '../_api/search'

export async function doSearch () {
  let currentInstance = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  let queryInSearch = store.get('queryInSearch')
  store.set({searchLoading: true})
  try {
    let results = await search(currentInstance, accessToken, queryInSearch)
    let currentQueryInSearch = store.get('queryInSearch') // avoid race conditions
    if (currentQueryInSearch === queryInSearch) {
      store.set({
        searchResultsForQuery: queryInSearch,
        searchResults: results
      })
    }
  } catch (e) {
    toast.say('Error during search: ' + (e.name || '') + ' ' + (e.message || ''))
    console.error(e)
  } finally {
    store.set({searchLoading: false})
  }
}
