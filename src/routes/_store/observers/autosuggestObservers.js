import { database } from '../../_database/database'

const SEARCH_RESULTS_LIMIT = 4
const DATABASE_SEARCH_RESULTS_LIMIT = 30

async function searchAccounts (store, searchText) {
  searchText = searchText.substring(1)
  let { currentInstance } = store.get()
  let results = await database.searchAccountsByUsername(
    currentInstance, searchText, DATABASE_SEARCH_RESULTS_LIMIT)
  return results.slice(0, SEARCH_RESULTS_LIMIT)
}

function searchEmoji (store, searchText) {
  searchText = searchText.toLowerCase().substring(1)
  let { currentCustomEmoji } = store.get()
  let results = currentCustomEmoji.filter(emoji => emoji.shortcode.toLowerCase().startsWith(searchText))
    .sort((a, b) => a.shortcode.toLowerCase() < b.shortcode.toLowerCase() ? -1 : 1)
    .slice(0, SEARCH_RESULTS_LIMIT)
  return results
}

export function autosuggestObservers (store) {
  store.observe('autosuggestSearchText', async autosuggestSearchText => {
    let { composeFocused } = store.get()
    if (!composeFocused || !autosuggestSearchText) {
      return
    }
    let autosuggestType = autosuggestSearchText.startsWith('@') ? 'account' : 'emoji'
    let results = (autosuggestType === 'account')
      ? await searchAccounts(store, autosuggestSearchText)
      : await searchEmoji(store, autosuggestSearchText)
    store.setForCurrentAutosuggest({
      autosuggestType,
      autosuggestSelected: 0,
      autosuggestSearchResults: results
    })
  })
}
