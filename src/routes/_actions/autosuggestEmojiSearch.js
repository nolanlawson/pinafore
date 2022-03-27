import { store } from '../_store/store.js'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask.js'
import * as emojiDatabase from '../_utils/emojiDatabase.js'
import { SEARCH_RESULTS_LIMIT } from '../_static/autosuggest.js'
import { testEmojiSupported } from '../_utils/testEmojiSupported.js'
import { mark, stop } from '../_utils/marks.js'

async function searchEmoji (searchText) {
  let emojis = await emojiDatabase.findBySearchQuery(searchText)

  const results = []

  if (searchText.startsWith(':') && searchText.endsWith(':')) {
    // exact shortcode search
    const shortcode = searchText.substring(1, searchText.length - 1).toLowerCase()
    emojis = emojis.filter(_ => _.shortcodes.includes(shortcode))
  }

  mark('testEmojiSupported')
  for (const emoji of emojis) {
    if (results.length === SEARCH_RESULTS_LIMIT) {
      break
    }
    if (emoji.url || testEmojiSupported(emoji.unicode)) { // emoji.url is a custom emoji
      results.push(emoji)
    }
  }
  stop('testEmojiSupported')
  return results
}

export function doEmojiSearch (searchText) {
  let canceled = false

  scheduleIdleTask(async () => {
    if (canceled) {
      return
    }
    const results = await searchEmoji(searchText)
    if (canceled) {
      return
    }
    store.setForCurrentAutosuggest({
      autosuggestType: 'emoji',
      autosuggestSelected: 0,
      autosuggestSearchResults: results
    })
  })

  return {
    cancel: () => {
      canceled = true
    }
  }
}
