const isLocalhost = !process.browser ||
  location.hostname === 'localhost' ||
  location.hostname === '127.0.0.1'

function targetIsLocalhost (instanceName) {
  return instanceName.startsWith('localhost:') || instanceName.startsWith('127.0.0.1:')
}

export function basename (instanceName) {
  if (isLocalhost && targetIsLocalhost(instanceName)) {
    return `http://${instanceName}`
  }
  return `https://${instanceName}`
}

export function auth (accessToken) {
  return {
    'Authorization': `Bearer ${accessToken}`
  }
}
