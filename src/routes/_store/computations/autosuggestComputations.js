import get from 'lodash-es/get'

const MIN_PREFIX_LENGTH = 1
const ACCOUNT_SEARCH_REGEX = new RegExp(`(?:\\s|^)(@\\S{${MIN_PREFIX_LENGTH},})$`)
const EMOJI_SEARCH_REGEX = new RegExp(`(?:\\s|^)(:[^:]{${MIN_PREFIX_LENGTH},})$`)

function computeForAutosuggest (store, key, defaultValue) {
  store.compute(key,
    ['currentInstance', 'currentComposeRealm', `autosuggestData_${key}`],
    (currentInstance, currentComposeRealm, root) => (
      get(root, [currentInstance, currentComposeRealm], defaultValue)
    )
  )
}

export function autosuggestComputations (store) {
  computeForAutosuggest(store, 'composeFocused', false)
  computeForAutosuggest(store, 'composeSelectionStart', 0)
  computeForAutosuggest(store, 'autosuggestSelected', 0)
  computeForAutosuggest(store, 'autosuggestSearchResults', [])
  computeForAutosuggest(store, 'autosuggestType', null)

  store.compute(
    'currentComposeText',
    ['currentComposeData', 'currentComposeRealm'],
    (currentComposeData, currentComposeRealm) => (
      get(currentComposeData, [currentComposeRealm, 'text'], '')
    )
  )

  store.compute(
    'autosuggestSearchText',
    ['currentComposeText', 'composeSelectionStart'],
    (currentComposeText, composeSelectionStart) => {
      let selectionStart = composeSelectionStart
      if (!currentComposeText || selectionStart < MIN_PREFIX_LENGTH) {
        return ''
      }

      let textUpToCursor = currentComposeText.substring(0, selectionStart)
      let match = textUpToCursor.match(ACCOUNT_SEARCH_REGEX) || textUpToCursor.match(EMOJI_SEARCH_REGEX)
      return (match && match[1]) || ''
    }
  )

  store.compute(
    'autosuggestNumSearchResults',
    ['autosuggestSearchResults'],
    (autosuggestSearchResults) => autosuggestSearchResults.length
  )

  store.compute(
    'autosuggestShown',
    ['composeFocused', 'autosuggestSearchText', 'autosuggestNumSearchResults'],
    (composeFocused, autosuggestSearchText, autosuggestNumSearchResults) => (
      !!(composeFocused && autosuggestSearchText && autosuggestNumSearchResults)
    )
  )
}
