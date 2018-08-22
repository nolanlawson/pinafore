import QuickLRU from 'quick-lru'

const CACHE_SIZE = 10

const dataCache = new QuickLRU({maxSize: CACHE_SIZE})
const modalCache = new QuickLRU({maxSize: CACHE_SIZE})

let modalId = -1

export function getNewModalId () {
  return ++modalId
}

export function setModalData (modalId, data) {
  dataCache.set(modalId, data)
}

export function getModalData (modalId) {
  return dataCache.get(modalId)
}

export function setModal (modalId, modal) {
  modalCache.set(modalId, modal)
}

export function getModal (modalId) {
  return modalCache.get(modalId)
}

export function removeModal(modalId) {
  modalCache.delete(modalId)
}
