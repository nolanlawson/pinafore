import { store } from '../_store/store'

export async function insertUsername (realm, username, startIndex, endIndex) {
  const { currentInstance } = store.get()
  const oldText = store.getComposeData(realm, 'text')
  const pre = oldText.substring(0, startIndex)
  const post = oldText.substring(endIndex)
  const newText = `${pre}@${username} ${post}`
  store.setComposeData(realm, { text: newText })
  store.setForAutosuggest(currentInstance, realm, { autosuggestSearchResults: [] })
}

export async function clickSelectedAutosuggestionUsername (realm) {
  const {
    composeSelectionStart,
    autosuggestSearchText,
    autosuggestSelected,
    autosuggestSearchResults
  } = store.get()
  const account = autosuggestSearchResults[autosuggestSelected]
  const startIndex = composeSelectionStart - autosuggestSearchText.length
  const endIndex = composeSelectionStart
  await insertUsername(realm, account.acct, startIndex, endIndex)
}

export function insertEmojiAtPosition (realm, emoji, startIndex, endIndex) {
  const { currentInstance } = store.get()
  const oldText = store.getComposeData(realm, 'text') || ''
  const pre = oldText.substring(0, startIndex)
  const post = oldText.substring(endIndex)
  const newText = `${pre}:${emoji.shortcode}: ${post}`
  store.setComposeData(realm, { text: newText })
  store.setForAutosuggest(currentInstance, realm, { autosuggestSearchResults: [] })
}

export async function clickSelectedAutosuggestionEmoji (realm) {
  const {
    composeSelectionStart,
    autosuggestSearchText,
    autosuggestSelected,
    autosuggestSearchResults
  } = store.get()
  const emoji = autosuggestSearchResults[autosuggestSelected]
  const startIndex = composeSelectionStart - autosuggestSearchText.length
  const endIndex = composeSelectionStart
  await insertEmojiAtPosition(realm, emoji, startIndex, endIndex)
}

export function selectAutosuggestItem (item) {
  const {
    currentComposeRealm,
    composeSelectionStart,
    autosuggestSearchText
  } = store.get()
  const startIndex = composeSelectionStart - autosuggestSearchText.length
  const endIndex = composeSelectionStart
  if (item.acct) {
    /* no await */ insertUsername(currentComposeRealm, item.acct, startIndex, endIndex)
  } else {
    /* no await */ insertEmojiAtPosition(currentComposeRealm, item, startIndex, endIndex)
  }
}
