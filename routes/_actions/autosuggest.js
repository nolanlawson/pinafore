import { store } from '../_store/store'

export async function insertUsername (realm, username, startIndex, endIndex) {
  let { currentInstance } = store.get()
  let oldText = store.getComposeData(realm, 'text')
  let pre = oldText.substring(0, startIndex)
  let post = oldText.substring(endIndex)
  let newText = `${pre}@${username} ${post}`
  store.setComposeData(realm, { text: newText })
  store.setForAutosuggest(currentInstance, realm, { autosuggestSearchResults: [] })
}

export async function clickSelectedAutosuggestionUsername (realm) {
  let {
    composeSelectionStart,
    autosuggestSearchText,
    autosuggestSelected,
    autosuggestSearchResults
  } = store.get()
  let account = autosuggestSearchResults[autosuggestSelected]
  let startIndex = composeSelectionStart - autosuggestSearchText.length
  let endIndex = composeSelectionStart
  await insertUsername(realm, account.acct, startIndex, endIndex)
}

export function insertEmojiAtPosition (realm, emoji, startIndex, endIndex) {
  let { currentInstance } = store.get()
  let oldText = store.getComposeData(realm, 'text') || ''
  let pre = oldText.substring(0, startIndex)
  let post = oldText.substring(endIndex)
  let newText = `${pre}:${emoji.shortcode}: ${post}`
  store.setComposeData(realm, { text: newText })
  store.setForAutosuggest(currentInstance, realm, { autosuggestSearchResults: [] })
}

export async function clickSelectedAutosuggestionEmoji (realm) {
  let {
    composeSelectionStart,
    autosuggestSearchText,
    autosuggestSelected,
    autosuggestSearchResults
  } = store.get()
  let emoji = autosuggestSearchResults[autosuggestSelected]
  let startIndex = composeSelectionStart - autosuggestSearchText.length
  let endIndex = composeSelectionStart
  await insertEmojiAtPosition(realm, emoji, startIndex, endIndex)
}

export function selectAutosuggestItem (item) {
  let {
    currentComposeRealm,
    composeSelectionStart,
    autosuggestSearchText
  } = store.get()
  let startIndex = composeSelectionStart - autosuggestSearchText.length
  let endIndex = composeSelectionStart
  if (item.acct) {
    /* no await */ insertUsername(currentComposeRealm, item.acct, startIndex, endIndex)
  } else {
    /* no await */ insertEmojiAtPosition(currentComposeRealm, item, startIndex, endIndex)
  }
}
