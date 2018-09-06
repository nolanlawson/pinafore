import {
  getAccount as _getAccount,
  searchAccountsByUsername as _searchAccountsByUsername,
  setAccount as _setAccount
} from './accounts'
import {
  clearDatabaseForInstance as _clearDatabaseForInstance
} from './clear'
import {
  getNotificationIdsForStatuses as _getNotificationIdsForStatuses,
  getReblogsForStatus as _getReblogsForStatus
} from './timelines/lookup'
import {
  getPinnedStatuses as _getPinnedStatuses,
  insertPinnedStatuses as _insertPinnedStatuses
} from './timelines/pinnedStatuses'
import {
  getTimeline as _getTimeline
} from './timelines/pagination'
import {
  getNotification as _getNotification,
  getStatus as _getStatus
} from './timelines/getStatusOrNotification'
import {
  setStatusFavorited as _setStatusFavorited,
  setStatusMuted as _setStatusMuted,
  setStatusPinned as _setStatusPinned,
  setStatusReblogged as _setStatusReblogged
} from './timelines/updateStatus'
import {
  deleteStatusesAndNotifications as _deleteStatusesAndNotifications
} from './timelines/deletion'
import {
  insertTimelineItems as _insertTimelineItems
} from './timelines/insertion'
import {
  getCustomEmoji as _getCustomEmoji,
  getInstanceInfo as _getInstanceInfo,
  getInstanceVerifyCredentials as _getInstanceVerifyCredentials,
  getLists as _getLists,
  setCustomEmoji as _setCustomEmoji,
  setInstanceInfo as _setInstanceInfo,
  setInstanceVerifyCredentials as _setInstanceVerifyCredentials,
  setLists as _setLists
} from './meta'
import {
  getRelationship as _getRelationship,
  setRelationship as _setRelationship
} from './relationships'

export async function getAccount (instanceName, accountId) {
  return _getAccount(instanceName, accountId)
}

export async function setAccount (instanceName, account) {
  return _setAccount(instanceName, account)
}

export async function searchAccountsByUsername (instanceName, usernamePrefix, limit) {
  return _searchAccountsByUsername(instanceName, usernamePrefix, limit)
}

export async function clearDatabaseForInstance (instanceName) {
  return _clearDatabaseForInstance(instanceName)
}

export async function getReblogsForStatus (instanceName, id) {
  return _getReblogsForStatus(instanceName, id)
}

export async function getNotificationIdsForStatuses (instanceName, statusIds) {
  return _getNotificationIdsForStatuses(instanceName, statusIds)
}

export async function insertPinnedStatuses (instanceName, accountId, statuses) {
  return _insertPinnedStatuses(instanceName, accountId, statuses)
}

export async function getPinnedStatuses (instanceName, accountId) {
  return _getPinnedStatuses(instanceName, accountId)
}

export async function getTimeline (instanceName, timeline, maxId, limit) {
  return _getTimeline(instanceName, timeline, maxId, limit)
}

export async function getStatus (instanceName, id) {
  return _getStatus(instanceName, id)
}

export async function getNotification (instanceName, id) {
  return _getNotification(instanceName, id)
}

export async function setStatusFavorited (instanceName, statusId, favorited) {
  return _setStatusFavorited(instanceName, statusId, favorited)
}

export async function setStatusReblogged (instanceName, statusId, reblogged) {
  return _setStatusReblogged(instanceName, statusId, reblogged)
}

export async function setStatusPinned (instanceName, statusId, pinned) {
  return _setStatusPinned(instanceName, statusId, pinned)
}

export async function setStatusMuted (instanceName, statusId, muted) {
  return _setStatusMuted(instanceName, statusId, muted)
}

export async function deleteStatusesAndNotifications (instanceName, statusIds, notificationIds) {
  return _deleteStatusesAndNotifications(instanceName, statusIds, notificationIds)
}

export async function insertTimelineItems (instanceName, timeline, timelineItems) {
  return _insertTimelineItems(instanceName, timeline, timelineItems)
}

export async function getInstanceVerifyCredentials (instanceName) {
  return _getInstanceVerifyCredentials(instanceName)
}

export async function setInstanceVerifyCredentials (instanceName, value) {
  return _setInstanceVerifyCredentials(instanceName, value)
}

export async function getInstanceInfo (instanceName) {
  return _getInstanceInfo(instanceName)
}

export async function setInstanceInfo (instanceName, value) {
  return _setInstanceInfo(instanceName, value)
}

export async function getLists (instanceName) {
  return _getLists(instanceName)
}

export async function setLists (instanceName, value) {
  return _setLists(instanceName, value)
}

export async function getCustomEmoji (instanceName) {
  return _getCustomEmoji(instanceName)
}

export async function setCustomEmoji (instanceName, value) {
  return _setCustomEmoji(instanceName, value)
}

export async function getRelationship (instanceName, accountId) {
  return _getRelationship(instanceName, accountId)
}

export async function setRelationship (instanceName, relationship) {
  return _setRelationship(instanceName, relationship)
}
