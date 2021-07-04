import { slide as svelteSlide } from 'svelte-transitions'
import { store } from '../_store/store.js'
import { noop } from '../_utils/lodash-lite.js'

// same as svelte-transitions, but respecting reduceMotion
export function slide (node, ref) {
  const { reduceMotion } = store.get()
  if (reduceMotion) {
    return {
      delay: 0,
      duration: 1, // setting to 0 causes some kind of built-in duration
      easing: _ => _,
      css: noop
    }
  }
  return svelteSlide(node, ref)
}
