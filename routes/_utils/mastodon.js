const WEBSITE = 'https://pinafore.social'
const REDIRECT_URI = (typeof location !== 'undefined' ? location.origin : 'https://pinafore.social') + '/settings/instances'
const SCOPES = 'read write follow'
const CLIENT_NAME = 'Pinafore'

export function registerApplication(instanceName) {
  const url = `https://${instanceName}/api/v1/apps`
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_name: CLIENT_NAME,
      redirect_uris: REDIRECT_URI,
      scopes: SCOPES,
      website: WEBSITE
    })
  })
}

export function generateAuthLink(instanceName, clientId) {
  let url = `https://${instanceName}/oauth/authorize`

  let params = new URLSearchParams()
  params.set('client_id', clientId)
  params.set('redirect_uri', REDIRECT_URI)
  params.set('response_type', 'code')
  params.set('scope', SCOPES)
  url += '?' + params.toString()
  return url
}

export function getAccessTokenFromAuthCode(instanceName, clientId, clientSecret, code) {
  let url = `https://${instanceName}/oauth/token`
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
      code: code
    })
  })
}

export function getHomeTimeline(instanceName, accessToken) {
  let url = `https://${instanceName}/api/v1/timelines/home`
  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  })
}