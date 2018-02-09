export const isFullscreen = () => !!(document.fullscreenElement ||
  document.webkitFullscreenElement ||
  document.mozFullScreenElement)

export const attachFullscreenListener = (listener) => {
  if ('onfullscreenchange' in document) {
    document.addEventListener('fullscreenchange', listener)
  } else if ('onwebkitfullscreenchange' in document) {
    document.addEventListener('webkitfullscreenchange', listener)
  } else if ('onmozfullscreenchange' in document) {
    document.addEventListener('mozfullscreenchange', listener)
  }
}

export const detachFullscreenListener = (listener) => {
  if ('onfullscreenchange' in document) {
    document.removeEventListener('fullscreenchange', listener)
  } else if ('onwebkitfullscreenchange' in document) {
    document.removeEventListener('webkitfullscreenchange', listener)
  } else if ('onmozfullscreenchange' in document) {
    document.removeEventListener('mozfullscreenchange', listener)
  }
}
