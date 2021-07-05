import { store } from '../_store/store.js'
import { cacheFirstUpdateAfter } from '../_utils/sync.js'
import { database } from '../_database/database.js'
import { getFollowRequests } from '../_api/followRequests.js'
import { get } from '../_utils/lodash-lite.js'

export async function updateFollowRequestCountIfLockedAccount (instanceName) {
  const { verifyCredentials, loggedInInstances } = store.get()

  if (!get(verifyCredentials, [instanceName, 'locked'])) {
    return
  }

  const accessToken = loggedInInstances[instanceName].access_token

  await cacheFirstUpdateAfter(
    async () => (await getFollowRequests(instanceName, accessToken)).length,
    () => database.getFollowRequestCount(instanceName),
    followReqsCount => database.setFollowRequestCount(instanceName, followReqsCount),
    followReqsCount => {
      const { followRequestCounts } = store.get()
      followRequestCounts[instanceName] = followReqsCount
      store.set({ followRequestCounts })
    }
  )
}
