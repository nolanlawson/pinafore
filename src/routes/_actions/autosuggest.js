import { store } from '../_store/store'

const emojiMapper = emoji => emoji.unicode ? emoji.unicode : `:${emoji.shortcodes[0]}:`
const hashtagMapper = hashtag => `#${hashtag.name}`
const accountMapper = account => `@${account.acct}`

async function insertTextAtPosition (realm, text, startIndex, endIndex) {
  const { currentInstance } = store.get()
  const oldText = store.getComposeData(realm, 'text')
  const pre = oldText.substring(0, startIndex)
  const post = oldText.substring(endIndex)
  const newText = `${pre}${text} ${post}`
  store.setComposeData(realm, { text: newText })
  store.setForAutosuggest(currentInstance, realm, { autosuggestSearchResults: [] })
}

export async function insertUsername (realm, account, startIndex, endIndex) {
  await insertTextAtPosition(realm, accountMapper(account), startIndex, endIndex)
}

export async function insertHashtag (realm, hashtag, startIndex, endIndex) {
  await insertTextAtPosition(realm, hashtagMapper(hashtag), startIndex, endIndex)
}

export async function insertEmojiAtPosition (realm, emoji, startIndex, endIndex) {
  await insertTextAtPosition(realm, emojiMapper(emoji), startIndex, endIndex)
}

async function clickSelectedItem (realm, resultMapper) {
  const {
    composeSelectionStart,
    autosuggestSearchText,
    autosuggestSelected,
    autosuggestSearchResults
  } = store.get()
  const result = autosuggestSearchResults[autosuggestSelected]
  const startIndex = composeSelectionStart - autosuggestSearchText.length
  const endIndex = composeSelectionStart
  await insertTextAtPosition(realm, resultMapper(result), startIndex, endIndex)
}

export async function clickSelectedAutosuggestionUsername (realm) {
  return clickSelectedItem(realm, accountMapper)
}

export async function clickSelectedAutosuggestionHashtag (realm) {
  return clickSelectedItem(realm, hashtagMapper)
}

export async function clickSelectedAutosuggestionEmoji (realm) {
  return clickSelectedItem(realm, emojiMapper)
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
    /* no await */ insertUsername(currentComposeRealm, item, startIndex, endIndex)
  } else if (item.shortcodes) {
    /* no await */ insertEmojiAtPosition(currentComposeRealm, item, startIndex, endIndex)
  } else { // hashtag
    /* no await */ insertHashtag(currentComposeRealm, item, startIndex, endIndex)
  }
}
