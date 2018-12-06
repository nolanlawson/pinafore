import localStorageMemory from 'localstorage-memory'
import { testHasLocalStorage } from './testStorage'

const safeLocalStorage = testHasLocalStorage() ? localStorage : localStorageMemory

export { safeLocalStorage }
