import { getAccount, searchAccountsByUsername, setAccount } from './accounts'
import { clearDatabaseForInstance } from './clear'
import { getNotificationIdsForStatuses, getReblogsForStatus } from './timelines/lookup'
import { getPinnedStatuses, insertPinnedStatuses } from './timelines/pinnedStatuses'
import { getNotificationTimeline, getStatusThread, getStatusTimeline, getTimeline } from './timelines/pagination'
import { getNotification, getStatus } from './timelines/getStatusOrNotification'
import { setStatusFavorited, setStatusMuted, setStatusPinned, setStatusReblogged } from './timelines/updateStatus'
import { deleteStatusesAndNotifications } from './timelines/deletion'
import {
  insertStatusThread, insertTimelineItems, insertTimelineNotifications,
  insertTimelineStatuses
} from './timelines/insertion'
import {
  getCustomEmoji,
  getInstanceInfo, getInstanceVerifyCredentials, getLists, setCustomEmoji, setInstanceInfo,
  setInstanceVerifyCredentials, setLists
} from './meta'
import { getRelationship, setRelationship } from './relationships'

export async function _getAccount (instanceName, accountId) {
  return getAccount(instanceName, accountId)
}

export async function _setAccount (instanceName, account) {
  return setAccount(instanceName, account)
}

export async function _searchAccountsByUsername (instanceName, usernamePrefix, limit) {
  return searchAccountsByUsername(instanceName, usernamePrefix, limit)
}

export async function _clearDatabaseForInstance (instanceName) {
  return clearDatabaseForInstance(instanceName)
}

export async function _getReblogsForStatus (instanceName, id) {
  return getReblogsForStatus(instanceName, id)
}

export async function _getNotificationIdsForStatuses (instanceName, statusIds) {
  return getNotificationIdsForStatuses(instanceName, statusIds)
}

export async function _insertPinnedStatuses (instanceName, accountId, statuses) {
  return insertPinnedStatuses(instanceName, accountId, statuses)
}

export async function _getPinnedStatuses (instanceName, accountId) {
  return getPinnedStatuses(instanceName, accountId)
}

export async function _getNotificationTimeline (instanceName, timeline, maxId, limit) {
  return getNotificationTimeline(instanceName, timeline, maxId, limit)
}

export async function _getStatusTimeline (instanceName, timeline, maxId, limit) {
  return getStatusTimeline(instanceName, timeline, maxId, limit)
}

export async function _getStatusThread (instanceName, statusId) {
  return getStatusThread(instanceName, statusId)
}

export async function _getTimeline (instanceName, timeline, maxId, limit) {
  return getTimeline(instanceName, timeline, maxId, limit)
}

export async function _getStatus (instanceName, id) {
  return getStatus(instanceName, id)
}

export async function _getNotification (instanceName, id) {
  return getNotification(instanceName, id)
}

export async function _setStatusFavorited (instanceName, statusId, favorited) {
  return setStatusFavorited(instanceName, statusId, favorited)
}

export async function _setStatusReblogged (instanceName, statusId, reblogged) {
  return setStatusReblogged(instanceName, statusId, reblogged)
}

export async function _setStatusPinned (instanceName, statusId, pinned) {
  return setStatusPinned(instanceName, statusId, pinned)
}

export async function _setStatusMuted (instanceName, statusId, muted) {
  return setStatusMuted(instanceName, statusId, muted)
}

export async function _deleteStatusesAndNotifications (instanceName, statusIds, notificationIds) {
  return deleteStatusesAndNotifications(instanceName, statusIds, notificationIds)
}

export async function _insertTimelineNotifications (instanceName, timeline, notifications) {
  return insertTimelineNotifications(instanceName, timeline, notifications)
}

export async function _insertTimelineStatuses (instanceName, timeline, statuses) {
  return insertTimelineStatuses(instanceName, timeline, statuses)
}

export async function _insertStatusThread (instanceName, statusId, statuses) {
  return insertStatusThread(instanceName, statusId, statuses)
}

export async function _insertTimelineItems (instanceName, timeline, timelineItems) {
  return insertTimelineItems(instanceName, timeline, timelineItems)
}

export async function _getInstanceVerifyCredentials (instanceName) {
  return getInstanceVerifyCredentials(instanceName)
}

export async function _setInstanceVerifyCredentials (instanceName, value) {
  return setInstanceVerifyCredentials(instanceName, value)
}

export async function _getInstanceInfo (instanceName) {
  return getInstanceInfo(instanceName)
}

export async function _setInstanceInfo (instanceName, value) {
  return setInstanceInfo(instanceName, value)
}

export async function _getLists (instanceName) {
  return getLists(instanceName)
}

export async function _setLists (instanceName, value) {
  return setLists(instanceName, value)
}

export async function _getCustomEmoji (instanceName) {
  return getCustomEmoji(instanceName)
}

export async function _setCustomEmoji (instanceName, value) {
  return setCustomEmoji(instanceName, value)
}

export async function _getRelationship (instanceName, accountId) {
  return getRelationship(instanceName, accountId)
}

export async function _setRelationship (instanceName, relationship) {
  return setRelationship(instanceName, relationship)
}