import { store } from '../_store/store.js'
import { toast } from '../_components/toast/toast.js'
import { bookmarkStatus, unbookmarkStatus } from '../_api/bookmark.js'
import { database } from '../_database/database.js'
import { formatIntl } from '../_utils/formatIntl.js'

export async function setStatusBookmarkedOrUnbookmarked (statusId, bookmarked) {
  const { currentInstance, accessToken } = store.get()
  try {
    if (bookmarked) {
      await bookmarkStatus(currentInstance, accessToken, statusId)
    } else {
      await unbookmarkStatus(currentInstance, accessToken, statusId)
    }
    if (bookmarked) {
      /* no await */ toast.say('intl.bookmarkedStatus')
    } else {
      /* no await */ toast.say('intl.unbookmarkedStatus')
    }
    store.setStatusBookmarked(currentInstance, statusId, bookmarked)
    await database.setStatusBookmarked(currentInstance, statusId, bookmarked)
  } catch (e) {
    console.error(e)
    /* no await */toast.say(
      bookmarked
        ? formatIntl('intl.unableToBookmark', { error: (e.message || '') })
        : formatIntl('intl.unableToUnbookmark', { error: (e.message || '') })
    )
  }
}
