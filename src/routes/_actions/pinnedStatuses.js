import { store } from '../_store/store.js'
import { cacheFirstUpdateAfter } from '../_utils/sync.js'
import { database } from '../_database/database.js'
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
