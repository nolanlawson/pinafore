import { favoriteStatus } from '../routes/_api/favorite'
import fetch from 'node-fetch'
import FileApi from 'file-api'
import { users } from './users'
import { postStatus } from '../routes/_api/statuses'
import { deleteStatus } from '../routes/_api/delete'
import { authorizeFollowRequest, getFollowRequests } from '../routes/_actions/followRequests'

global.fetch = fetch
global.File = FileApi.File
global.FormData = FileApi.FormData

const instanceName = 'localhost:3000'

export async function favoriteStatusAsAdmin (statusId) {
  return favoriteStatus(instanceName, users.admin.accessToken, statusId)
}

export async function postAsAdmin (text) {
  return postStatus(instanceName, users.admin.accessToken, text,
    null, null, false, null, 'public')
}

export async function postReplyAsAdmin (text, inReplyTo) {
  return postStatus(instanceName, users.admin.accessToken, text,
    inReplyTo, null, false, null, 'public')
}

export async function deleteAsAdmin (statusId) {
  return deleteStatus(instanceName, users.admin.accessToken, statusId)
}

export async function getFollowRequestsAsLockedAccount () {
  return getFollowRequests(instanceName, users.LockedAccount.accessToken)
}

export async function authorizeFollowRequestAsLockedAccount (id) {
  return authorizeFollowRequest(instanceName, users.LockedAccount.accessToken, id)
}
