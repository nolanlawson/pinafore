const isLocalhost = process.browser && process.env.NODE_ENV !== 'production' &&
  (document.location.hostname === 'localhost' ||
  document.location.hostname === '127.0.0.1')

function targetIsLocalhost (instanceName) {
  return process.browser && process.env.NODE_ENV !== 'production' &&
    (instanceName.startsWith('localhost:') || instanceName.startsWith('127.0.0.1:'))
}

export function basename (instanceName) {
  if (isLocalhost && targetIsLocalhost(instanceName)) {
    return `http://${instanceName}`
  }
  return `https://${instanceName}`
}
