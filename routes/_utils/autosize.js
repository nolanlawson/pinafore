// Modified from https://github.com/jackmoore/autosize/blob/113f1b3/src/autosize.js
// The only change is to remove IE-specific hacks,
// remove parent overflow checks, make page resizes more performant,
// add deferredUpdate, and add perf marks.

import { mark, stop } from './marks'
import debounce from 'lodash-es/debounce'
import throttle from 'lodash-es/throttle'

const map = new Map()
let createEvent = (name) => new Event(name, {bubbles: true})

function assign (ta) {
  if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || map.has(ta)) {
    return
  }

  // TODO: hack - grab our scroll container so we can maintain the scrollTop
  let container = document.getElementsByClassName('container')[0]
  let heightOffset = null
  let cachedHeight = null

  function init () {
    const style = window.getComputedStyle(ta, null)

    if (style.boxSizing === 'content-box') {
      heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom))
    } else {
      heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
    }

    update()
  }

  function resize () {
    mark('autosize:resize()')
    let res = _resize()
    stop('autosize:resize()')
    return res
  }

  function _resize () {
    const originalHeight = ta.style.height
    const scrollTop = container.scrollTop

    ta.style.height = '' // this may change the scrollTop in Firefox

    const endHeight = ta.scrollHeight + heightOffset

    if (ta.scrollHeight === 0) {
      // If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
      ta.style.height = originalHeight
      return
    }

    ta.style.height = endHeight + 'px'
    container.scrollTop = scrollTop // Firefox jiggles if we don't reset the scrollTop of the container
    return endHeight
  }

  const deferredUpdate = throttle(() => requestAnimationFrame(update), 100)

  function update () {
    mark('autosize:update()')
    _update()
    stop('autosize:update()')
  }

  function _update () {
    let newHeight = resize()
    if (cachedHeight !== newHeight) {
      cachedHeight = newHeight
      const evt = createEvent('autosize:resized')
      try {
        ta.dispatchEvent(evt)
      } catch (err) {
        // Firefox will throw an error on dispatchEvent for a detached element
        // https://bugzilla.mozilla.org/show_bug.cgi?id=889376
      }
    }
  }

  const pageResize = debounce(() => requestAnimationFrame(update), 1000)

  const destroy = () => {
    window.removeEventListener('resize', pageResize, false)
    ta.removeEventListener('input', deferredUpdate, false)
    ta.removeEventListener('autosize:destroy', destroy, false)
    ta.removeEventListener('autosize:update', update, false)

    map.delete(ta)
  }

  ta.addEventListener('autosize:destroy', destroy, false)

  window.addEventListener('resize', pageResize, false)
  ta.addEventListener('input', deferredUpdate, false)
  ta.addEventListener('autosize:update', update, false)

  map.set(ta, {
    destroy,
    update
  })

  init()
}

function destroy (ta) {
  const methods = map.get(ta)
  if (methods) {
    methods.destroy()
  }
}

function update (ta) {
  const methods = map.get(ta)
  if (methods) {
    methods.update()
  }
}

let autosize = (el, options) => {
  if (el) {
    Array.prototype.forEach.call(el.length ? el : [el], x => assign(x, options))
  }
  return el
}
autosize.destroy = el => {
  if (el) {
    Array.prototype.forEach.call(el.length ? el : [el], destroy)
  }
  return el
}
autosize.update = el => {
  if (el) {
    Array.prototype.forEach.call(el.length ? el : [el], update)
  }
  return el
}

export { autosize }
