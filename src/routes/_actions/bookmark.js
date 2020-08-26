import { store } from '../_store/store'
import { toast } from '../_components/toast/toast'
import { bookmarkStatus, unbookmarkStatus } from '../_api/bookmark'
import { database } from '../_database/database'

export async function setStatusBookmarkedOrUnbookmarked (statusId, bookmarked) {
  const { currentInstance, accessToken } = store.get()
  try {
    if (bookmarked) {
      await bookmarkStatus(currentInstance, accessToken, statusId)
    } else {
      await unbookmarkStatus(currentInstance, accessToken, statusId)
    }
    if (bookmarked) {
      toast.say('Bookmarked toot')
    } else {
      toast.say('Unbookmarked toot')
    }
    store.setStatusBookmarked(currentInstance, statusId, bookmarked)
    await database.setStatusBookmarked(currentInstance, statusId, bookmarked)
  } catch (e) {
    console.error(e)
    toast.say(`Unable to ${bookmarked ? 'bookmark' : 'unbookmark'} toot: ` + (e.message || ''))
  }
}
