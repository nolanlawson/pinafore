import {
  accountsCache, setInCache, statusesCache
} from '../cache'

export function cacheStatus (status, instanceName) {
  setInCache(statusesCache, instanceName, status.id, status)
  setInCache(accountsCache, instanceName, status.account.id, status.account)
  if (status.reblog) {
    setInCache(accountsCache, instanceName, status.reblog.account.id, status.reblog.account)
  }
}
