function targetIsLocalhost (instanceName) {
  return true // instanceName.startsWith('localhost:') || instanceName.startsWith('127.0.0.1:')
}

export function basename (instanceName) {
  if (targetIsLocalhost(instanceName)) {
    return `http://${instanceName}`
  }
  return `https://${instanceName}`
}

export function auth (accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`
  }
}
