const WEBSITE = 'https://pinafore.social'
const REDIRECT_URI = (typeof location !== 'undefined' ? location.origin : 'https://pinafore.social') + '/settings/instances'
const SCOPES = 'read write follow'
const CLIENT_NAME = 'Pinafore'
import { post, get, paramsString } from '../ajax'

export function registerApplication(instanceName) {
  const url = `https://${instanceName}/api/v1/apps`
  return post(url, {
      client_name: CLIENT_NAME,
      redirect_uris: REDIRECT_URI,
      scopes: SCOPES,
      website: WEBSITE
  })
}

export function generateAuthLink(instanceName, clientId) {
  let params = paramsString({
    'client_id': clientId,
    'redirect_uri': REDIRECT_URI,
    'response_type': 'code',
    'scope': SCOPES
  })
  return `https://${instanceName}/oauth/authorize?${params}`
}

export function getAccessTokenFromAuthCode(instanceName, clientId, clientSecret, code) {
  let url = `https://${instanceName}/oauth/token`
  return post(url, {
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
    code: code
  })
}

export function getHomeTimeline(instanceName, accessToken) {
  let url = `https://${instanceName}/api/v1/timelines/home`
  return get(url, {
    'Authorization': `Bearer ${accessToken}`
  })
}