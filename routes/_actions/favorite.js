import { favoriteStatus, unfavoriteStatus } from '../_api/favorite'
import { store } from '../_store/store'
import { toast } from '../_utils/toast'
import {
  setStatusFavorited as setStatusFavoritedInDatabase
} from '../_database/timelines/updateStatus'
import { emit } from '../_utils/eventBus'

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
  emit('statusUpdated', statusId, _ => Object.assign({}, _, {favourited: favorited})) // optimistic update
  try {
    await networkPromise
    await setStatusFavoritedInDatabase(currentInstance, statusId, favorited)
  } catch (e) {
    console.error(e)
    toast.say(`Failed to ${favorited ? 'favorite' : 'unfavorite'}. ` + (e.message || ''))
    emit('statusUpdated', statusId, _ => Object.assign({}, _, {favourited: !favorited})) // undo optimistic update
  }
}
