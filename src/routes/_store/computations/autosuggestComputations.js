import { get } from '../../_utils/lodash-lite'

const MIN_PREFIX_LENGTH = 2
// Technically mastodon accounts allow dots, but it would be weird to do an autosuggest search if it ends with a dot.
// Also this is rare. https://github.com/tootsuite/mastodon/pull/6844
const VALID_ACCOUNT_AND_EMOJI_CHAR = '\\w'
const ACCOUNT_SEARCH_REGEX = new RegExp(`(?:\\s|^)(@${VALID_ACCOUNT_AND_EMOJI_CHAR}{${MIN_PREFIX_LENGTH},})$`)
const EMOJI_SEARCH_REGEX = new RegExp(`(?:\\s|^)(:${VALID_ACCOUNT_AND_EMOJI_CHAR}{${MIN_PREFIX_LENGTH},})$`)

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
      const selectionStart = composeSelectionStart
      if (!currentComposeText || selectionStart < MIN_PREFIX_LENGTH) {
        return ''
      }

      const textUpToCursor = currentComposeText.substring(0, selectionStart)
      const match = textUpToCursor.match(ACCOUNT_SEARCH_REGEX) || textUpToCursor.match(EMOJI_SEARCH_REGEX)
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
