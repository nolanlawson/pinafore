import { store } from '../_store/store'
import { toast } from '../_components/toast/toast'
import { bookmarkStatus, unbookmarkStatus } from '../_api/bookmark'
import { database } from '../_database/database'
import { formatIntl } from '../_utils/formatIntl'

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
