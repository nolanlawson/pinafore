function targetIsLocalhost (instanceName) {
  return /^(?:localhost|127.0.0.1):/.test(instanceName)
}

export function basename (instanceName) {
  const isLocalhost = targetIsLocalhost(instanceName)
  return `http${isLocalhost ? '' : 's'}://${instanceName}`
}

export function auth (accessToken) {
  return {
    'Authorization': `Bearer ${accessToken}`
  }
}
