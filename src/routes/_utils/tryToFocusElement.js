// try 5 times to wait for the element to be rendered and then focus it
import { scheduleIdleTask } from './scheduleIdleTask'

const RETRIES = 5
const TIMEOUT = 50

export async function tryToFocusElement (id) {
  for (let i = 0; i < RETRIES; i++) {
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, TIMEOUT))
    }
    await new Promise(resolve => scheduleIdleTask(resolve))
    const element = document.getElementById(id)
    if (element) {
      try {
        element.focus({ preventScroll: true })
        console.log('focused element', id)
        return
      } catch (e) {
        console.error(e)
      }
    }
  }
  console.log('failed to focus element', id)
}
