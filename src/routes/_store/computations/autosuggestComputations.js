import { get } from '../../_utils/lodash-lite.js'
import { mark, stop } from '../../_utils/marks.js'

const MIN_PREFIX_LENGTH = 2
// Technically mastodon accounts allow dots, but it would be weird to do an autosuggest search if it ends with a dot.
// Also this is rare. https://github.com/tootsuite/mastodon/pull/6844
// However for emoji search we allow some extra things (e.g. :+1:, :white_heart:)
const VALID_CHARS = '[\\w\\+_\\-:]'
const PREFIXES = '(?:@|:|#)'
const REGEX = new RegExp(`(?:\\s|^)(${PREFIXES}${VALID_CHARS}{${MIN_PREFIX_LENGTH},})$`)

function computeForAutosuggest (store, key, defaultValue) {
  store.compute(key,
    ['currentInstance', 'currentComposeRealm', `autosuggestData_${key}`],
    (currentInstance, currentComposeRealm, root) => (
      get(root, [currentInstance, currentComposeRealm], defaultValue)
    )
  )
}

export function autosuggestComputations (store) {
  mark('autosuggestComputations')
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
      const match = textUpToCursor.match(REGEX)
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
  stop('autosuggestComputations')
}
