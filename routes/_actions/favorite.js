import { favoriteStatus, unfavoriteStatus } from '../_api/favorite'
import { store } from '../_store/store'
import { database } from '../_database/database'
import { toast } from '../_utils/toast'

export async function setFavorited(statusId, favorited) {
  let instanceName = store.get('currentInstance')
  let accessToken = store.get('accessToken')
  try {
    let status = await (favorited
        ? favoriteStatus(instanceName, accessToken, statusId)
        : unfavoriteStatus(instanceName, accessToken, statusId))
    await database.insertStatus(instanceName, status)
    let statusModifications = store.get('statusModifications')
    let currentStatusModifications = statusModifications[instanceName] =
      (statusModifications[instanceName] || {favorites: {}, reblogs: {}})
    currentStatusModifications.favorites[statusId] = favorited
    store.set({statusModifications: statusModifications})
  } catch (e) {
    toast.say('Failed to favorite/unfavorite. Please try again.')
  }
}