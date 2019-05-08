import { snackbar } from '../_components/snackbar/snackbar'

function onUpdateFound (registration) {
  const newWorker = registration.installing

  newWorker.addEventListener('statechange', async () => {
    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
      snackbar.announce('App update available.', 'Reload', () => document.location.reload(true))
    }
  })
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(registration => {
    registration.addEventListener('updatefound', () => onUpdateFound(registration))
  })
}
