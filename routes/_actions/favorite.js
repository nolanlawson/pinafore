import { favoriteStatus, unfavoriteStatus } from '../_api/favorite'
import { store } from '../_store/store'
import { database } from '../_database/database'
import { toast } from '../_utils/toast'

export async function setFavorited (statusId, favorited) {
  if (!store.get('online')) {
    toast.say('You cannot favorite or unfavorite while offline.')
    return
  }
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  try {
    await (favorited
        ? favoriteStatus(instanceName, accessToken, statusId)
        : unfavoriteStatus(instanceName, accessToken, statusId))
    await database.setStatusFavorited(instanceName, statusId, favorited)
    let statusModifications = store.get('statusModifications')
    let currentStatusModifications = statusModifications[instanceName] =
      (statusModifications[instanceName] || {favorites: {}, reblogs: {}})
    currentStatusModifications.favorites[statusId] = favorited
    store.set({statusModifications: statusModifications})
  } catch (e) {
    console.error(e)
    toast.say('Failed to favorite or unfavorite. ' + (e.message || ''))
  }
}
