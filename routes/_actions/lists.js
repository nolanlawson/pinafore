import { store } from '../_store/store'
import { getLists } from '../_api/lists'
import { cacheFirstUpdateAfter } from '../_utils/sync'
import { database } from '../_database/database'

export async function updateLists () {
  let { currentInstance, accessToken } = store.get()

  await cacheFirstUpdateAfter(
    () => getLists(currentInstance, accessToken),
    () => database.getLists(currentInstance),
    lists => database.setLists(currentInstance, lists),
    lists => {
      let { instanceLists } = store.get()
      instanceLists[currentInstance] = lists
      store.set({instanceLists: instanceLists})
    }
  )
}
