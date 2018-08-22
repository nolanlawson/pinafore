import { importShowImageDialog, importShowVideoDialog } from '../../_components/dialog/asyncDialogs'
import { modalDataCache, modalCache } from '../../_utils/modalCache'

function normalizeHash (hash) {
  return (hash || '').replace(/^#/, '')
}

function getIdFromHash (hash) {
  return hash.split('-').slice(-1)[0]
}

export function hashObservers (store) {
  if (!process.browser) {
    return
  }

  store.observe('hash', async (hash, previousHash) => {
    hash = normalizeHash(hash)
    previousHash = normalizeHash(previousHash)

    let modalId = getIdFromHash(hash)
    let previousModalId = getIdFromHash(previousHash)

    if (hash.startsWith('modal-') && modalDataCache.has(modalId)) {
      let showDialog = await (hash.startsWith('modal-image-') ? importShowImageDialog() : importShowVideoDialog())
      let modalData = modalDataCache.get(modalId)
      let dialog = showDialog(modalData)
      modalCache.set(modalId, dialog)
    } else if (previousHash.startsWith('modal-')) {
      let modal = modalCache.get(previousModalId)
      if (modal) {
        modal.close()
      }
      modalCache.delete(previousModalId)
      modalDataCache.delete(previousModalId)
    }
  })

  window.addEventListener('hashchange', () => {
    store.set({hash: location.hash})
  })
}
