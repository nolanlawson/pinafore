import { favoriteStatus } from '../routes/_api/favorite'
import fetch from 'node-fetch'
import FileApi from 'file-api'
import { users } from './users'
import { postStatus } from '../routes/_api/statuses'
import { deleteStatus } from '../routes/_api/delete'
import { authorizeFollowRequest, getFollowRequests } from '../routes/_actions/followRequests'
import { followAccount, unfollowAccount } from '../routes/_api/follow'
import { updateCredentials } from '../routes/_api/updateCredentials'

global.fetch = fetch
global.File = FileApi.File
global.FormData = FileApi.FormData

const instanceName = 'localhost:3000'

export async function favoriteStatusAs (username, statusId) {
  return favoriteStatus(instanceName, users[username].accessToken, statusId)
}

export async function postAs (username, text) {
  return postStatus(instanceName, users[username].accessToken, text,
    null, null, false, null, 'public')
}

export async function postReplyAs (username, text, inReplyTo) {
  return postStatus(instanceName, users[username].accessToken, text,
    inReplyTo, null, false, null, 'public')
}

export async function deleteAs (username, statusId) {
  return deleteStatus(instanceName, users[username].accessToken, statusId)
}

export async function getFollowRequestsAs (username) {
  return getFollowRequests(instanceName, users[username].accessToken)
}

export async function authorizeFollowRequestAs (username, id) {
  return authorizeFollowRequest(instanceName, users[username].accessToken, id)
}

export async function followAs (username, userToFollow) {
  return followAccount(instanceName, users[username].accessToken, users[userToFollow].id)
}

export async function unfollowAs (username, userToFollow) {
  return unfollowAccount(instanceName, users[username].accessToken, users[userToFollow].id)
}

export async function updateUserDisplayNameAs (username, displayName) {
  return updateCredentials(instanceName, users[username].accessToken, {display_name: displayName})
}
