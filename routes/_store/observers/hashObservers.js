import { getModalData, getModal, removeModal, setModal } from '../../_utils/modalCache'
import { importShowImageDialog } from '../../_components/dialog/asyncDialogs'

function normalizeHash (hash) {
  return (hash || '').replace(/^#/, '')
}

function getIdFromHash (hash) {
  return parseInt(hash.split('-').slice(-1)[0], 10)
}

export function hashObservers (store) {
  if (!process.browser) {
    return
  }

  store.observe('hash', async (hash, previousHash) => {
    hash = normalizeHash(hash)
    previousHash = normalizeHash(hash)

    if (hash.startsWith('image-')) {
      let modalId = getIdFromHash(hash)
      let { previewUrl, url, modalWidth, modalHeight, description, type } = getModalData(modalId)
      let showImageDialog = await importShowImageDialog()
      let dialog = showImageDialog(previewUrl, url, type, modalWidth, modalHeight, description)
      setModal(modalId, dialog)
    } else if (!hash && previousHash.startsWith('image-')) {
      let modalId = getIdFromHash(previousHash)
      let modal = getModal(modalId)
      removeModal(modalId)
      modal.close()
    }
  })

  window.addEventListener('hashchange', () => {
    store.set({hash: location.hash})
  })
}
