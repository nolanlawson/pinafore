import { accountsCache, clearCache, metaCache, statusesCache } from './cache'
import { deleteDatabase } from './databaseLifecycle'

export async function clearDatabaseForInstance (instanceName) {
  clearCache(statusesCache, instanceName)
  clearCache(accountsCache, instanceName)
  clearCache(metaCache, instanceName)
  await deleteDatabase(instanceName)
}
