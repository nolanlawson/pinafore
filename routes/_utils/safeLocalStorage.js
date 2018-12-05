import localStorageMemory from 'localstorage-memory'

let safeLocalStorage

try {
  safeLocalStorage = process.browser && localStorage // safari throws here if cookies are disabled
} catch (e) {
  safeLocalStorage = localStorageMemory
}

export { safeLocalStorage }
