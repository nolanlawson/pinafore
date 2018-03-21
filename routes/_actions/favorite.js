import { favoriteStatus, unfavoriteStatus } from '../_api/favorite'
import { store } from '../_store/store'
import { database } from '../_database/database'
import { toast } from '../_utils/toast'

export async function setFavorited (statusId, favorited) {
  if (!store.get('online')) {
    toast.say(`You cannot ${favorited ? 'favorite' : 'unfavorite'} while offline.`)
    return
  }
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  let networkPromise = favorited
    ? favoriteStatus(instanceName, accessToken, statusId)
    : unfavoriteStatus(instanceName, accessToken, statusId)
  store.setStatusFavorited(instanceName, statusId, favorited) // optimistic update
  try {
    await networkPromise
    await database.setStatusFavorited(instanceName, statusId, favorited)
  } catch (e) {
    console.error(e)
    toast.say(`Failed to ${favorited ? 'favorite' : 'unfavorite'}. ` + (e.message || ''))
    store.setStatusFavorited(instanceName, statusId, !favorited) // undo optimistic update
  }
}
