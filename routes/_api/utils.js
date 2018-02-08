const isLocalhost = process.browser && process.env.NODE_ENV !== 'production' &&
  (document.location.hostname === 'localhost' ||
  document.location.hostname === '127.0.0.1')

function targetIsLocalhost(instanceName) {
  return process.browser && process.env.NODE_ENV !== 'production' &&
    (instanceName === 'localhost:3000' || instanceName === '127.0.0.1:3000')
}

export function basename(instanceName) {
  if (isLocalhost && targetIsLocalhost(instanceName)) {
    return `http://${instanceName}`
  }
  return `https://${instanceName}`
}