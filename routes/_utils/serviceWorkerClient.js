import { toast } from './toast'
import { keyval } from './database/keyval'

function onUpdateFound(registration) {
  const newWorker = registration.installing

  newWorker.addEventListener('statechange', async () => {
    if (!(await keyval.get('serviceworker_installed'))) {
      await keyval.set('serviceworker_installed', true)
      return
    }
    if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
      toast.say('App update available. Reload to update.')
    }
  });
}

if (!location.origin.match('localhost') && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(registration => {
    registration.addEventListener('updatefound', () => onUpdateFound(registration))
  })
}