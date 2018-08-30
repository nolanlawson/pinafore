import { store } from '../_store/store'
import { cacheFirstUpdateAfter } from '../_utils/sync'
import { database } from '../_database/database'
import {
  getPinnedStatuses
} from '../_api/pinnedStatuses'

export async function updatePinnedStatusesForAccount (accountId) {
  let { currentInstance, accessToken } = store.get()

  await cacheFirstUpdateAfter(
    () => getPinnedStatuses(currentInstance, accessToken, accountId),
    () => database.getPinnedStatuses(currentInstance, accountId),
    statuses => database.insertPinnedStatuses(currentInstance, accountId, statuses),
    statuses => {
      let { pinnedStatuses } = store.get()
      pinnedStatuses[currentInstance] = pinnedStatuses[currentInstance] || {}
      pinnedStatuses[currentInstance][accountId] = statuses
      store.set({ pinnedStatuses: pinnedStatuses })
    }
  )
}
