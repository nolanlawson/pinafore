import { store } from '../_store/store'
import { toast } from '../_components/toast/toast'
import { search } from '../_api/search'
import { formatIntl } from '../_utils/formatIntl'

export async function doSearch () {
  const { currentInstance, accessToken, queryInSearch } = store.get()
  store.set({ searchLoading: true })
  try {
    const results = await search(currentInstance, accessToken, queryInSearch)
    const { queryInSearch: newQueryInSearch } = store.get() // avoid race conditions
    if (newQueryInSearch === queryInSearch) {
      store.set({
        searchResultsForQuery: queryInSearch,
        searchResults: results
      })
    }
  } catch (e) {
    /* no await */ toast.say(formatIntl('intl.searchError', { error: (e.message || '') }))
    console.error(e)
  } finally {
    store.set({ searchLoading: false })
  }
}
