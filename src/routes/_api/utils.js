function targetIsLocalhost (instanceName) {
  return instanceName.startsWith('localhost:') || instanceName.startsWith('127.0.0.1:')
}

export function basename (instanceName) {
  if (targetIsLocalhost(instanceName)) {
    return `http://${instanceName}`
  }
  return `https://${instanceName}`
}

export function auth (accessToken) {
  if (accessToken === undefined || accessToken === null) {
    return {}
  }

  return {
    'Authorization': `Bearer ${accessToken}`
  }
}
