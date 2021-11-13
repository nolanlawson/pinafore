import { fetchAccount } from './fetchAccount.js'
import { ACCOUNT_ID, STATUS_ID } from '../constants.js'
import { fetchStatus } from './fetchStatus.js'

export function fetchNotification (notificationsStore, statusesStore, accountsStore, id, callback) {
  notificationsStore.get(id).onsuccess = e => {
    const notification = e.target.result
    callback(notification)
    if (!notification) {
      return
    }
    fetchAccount(accountsStore, notification[ACCOUNT_ID], account => {
      notification.account = account
    })
    if (notification[STATUS_ID]) {
      fetchStatus(statusesStore, accountsStore, notification[STATUS_ID], status => {
        notification.status = status
      })
    }
  }
}
