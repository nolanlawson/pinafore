import localStorageMemory from 'localstorage-memory'
import { testHasLocalStorage } from './testStorage.js'

const safeLocalStorage = testHasLocalStorage() ? localStorage : localStorageMemory

export { safeLocalStorage }
