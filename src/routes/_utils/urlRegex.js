import { thunk } from './thunk'

export const urlRegex = thunk(() => {
  // this is provided at build time to avoid having a lot of runtime code just to build
  // a static regex
  return process.env.URL_REGEX
})
