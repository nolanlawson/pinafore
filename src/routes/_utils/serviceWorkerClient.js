import { snackbar } from '../_components/snackbar/snackbar'

// A lot of this code is borrowed from https://github.com/GoogleChromeLabs/squoosh/blob/53b46f8/src/lib/offliner.ts
// Service Workers are hard!

// Tell the service worker to skip waiting
async function skipWaiting () {
  const reg = await navigator.serviceWorker.getRegistration()
  if (!reg || !reg.waiting) {
    return
  }
  reg.waiting.postMessage('skip-waiting')
}

// Wait for an installing worker
async function installingWorker (reg) {
  if (reg.installing) {
    return reg.installing
  }
  return new Promise((resolve) => {
    reg.addEventListener(
      'updatefound',
      () => resolve(reg.installing),
      { once: true }
    )
  })
}

// Wait a service worker to become waiting
async function updateReady (reg) {
  if (reg.waiting) {
    return
  }
  const installing = await installingWorker(reg)
  return new Promise((resolve) => {
    const listener = () => {
      if (installing.state === 'installed') {
        installing.removeEventListener('statechange', listener)
        resolve()
      }
    }
    installing.addEventListener('statechange', listener)
  })
}

(async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')

    const hasController = !!navigator.serviceWorker.controller

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hasController) { // first install
        return
      }

      location.reload()
    })

    // If we don't have a controller, we don't need to check for updates – we've just loaded from the
    // network.
    if (!hasController) {
      return
    }

    const reg = await navigator.serviceWorker.getRegistration()
    if (!reg) { // SW not registered yet
      return
    }

    // Look for updates
    await updateReady(reg)

    // Ask the user if they want to update.
    snackbar.announce('App update available.', 'Reload', () => {
      // Tell the waiting worker to activate, this will change the controller and cause a reload (see
      // 'controllerchange')
      /* no await */ skipWaiting()
    })
  }
})()
