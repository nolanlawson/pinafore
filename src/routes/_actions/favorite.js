import { favoriteStatus, unfavoriteStatus } from '../_api/favorite'
import { store } from '../_store/store'
import { toast } from '../_utils/toast'
import { database } from '../_database/database'

export async function setFavorited (statusId, favorited) {
  let { online } = store.get()
  if (!online) {
    toast.say(`You cannot ${favorited ? 'favorite' : 'unfavorite'} while offline.`)
    return
  }
  let { currentInstance, accessToken } = store.get()
  let networkPromise = favorited
    ? favoriteStatus(currentInstance, accessToken, statusId)
    : unfavoriteStatus(currentInstance, accessToken, statusId)
  store.setStatusFavorited(currentInstance, statusId, favorited) // optimistic update
  try {
    await networkPromise
    await database.setStatusFavorited(currentInstance, statusId, favorited)
  } catch (e) {
    console.error(e)
    toast.say(`Failed to ${favorited ? 'favorite' : 'unfavorite'}. ` + (e.message || ''))
    store.setStatusFavorited(currentInstance, statusId, !favorited) // undo optimistic update
  }
}
