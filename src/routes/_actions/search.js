import { store } from '../_store/store'
import { toast } from '../_utils/toast'
import { search } from '../_api/search'

export async function doSearch () {
  let { currentInstance, accessToken, queryInSearch } = store.get()
  store.set({ searchLoading: true })
  try {
    let results = await search(currentInstance, accessToken, queryInSearch)
    let { queryInSearch: newQueryInSearch } = store.get() // avoid race conditions
    if (newQueryInSearch === queryInSearch) {
      store.set({
        searchResultsForQuery: queryInSearch,
        searchResults: results
      })
    }
  } catch (e) {
    toast.say('Error during search: ' + (e.name || '') + ' ' + (e.message || ''))
    console.error(e)
  } finally {
    store.set({ searchLoading: false })
  }
}
