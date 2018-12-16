import { toast } from './toast'

function onUpdateFound (registration) {
  const newWorker = registration.installing

  newWorker.addEventListener('statechange', async () => {
    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
      toast.say('App update available. Reload to update.')
    }
  })
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(registration => {
    registration.addEventListener('updatefound', () => onUpdateFound(registration))
  })
}
