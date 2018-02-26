// Modified from https://github.com/jackmoore/autosize/commit/113f1b345868901619d4b01cda02b09aa1690ebd
// The only change is to remove IE-specific hacks,
// remove parent overflow checks, make page resizes more performant,
// add deferredUpdate, and add perf marks.

import { mark, stop } from './marks'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

const map = new Map()
let createEvent = (name) => new Event(name, {bubbles: true})

function assign (ta) {
  if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || map.has(ta)) return

  let heightOffset = null
  let cachedHeight = null

  function init () {
    const style = window.getComputedStyle(ta, null)

    if (style.resize === 'vertical') {
      ta.style.resize = 'none'
    } else if (style.resize === 'both') {
      ta.style.resize = 'horizontal'
    }

    if (style.boxSizing === 'content-box') {
      heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom))
    } else {
      heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
    }
    // Fix when a textarea is not on document body and heightOffset is Not a Number
    if (isNaN(heightOffset)) {
      heightOffset = 0
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

    ta.style.height = ''

    let endHeight = ta.scrollHeight + heightOffset

    if (ta.scrollHeight === 0) {
      // If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
      ta.style.height = originalHeight
      return
    }

    ta.style.height = endHeight + 'px'
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

  const pageResize = debounce(update, 1000)

  const destroy = (style => {
    window.removeEventListener('resize', pageResize, false)
    ta.removeEventListener('input', deferredUpdate, false)
    ta.removeEventListener('autosize:destroy', destroy, false)
    ta.removeEventListener('autosize:update', update, false)

    Object.keys(style).forEach(key => {
      ta.style[key] = style[key]
    })

    map.delete(ta)
  }).bind(ta, {
    height: ta.style.height,
    resize: ta.style.resize,
    overflowY: ta.style.overflowY,
    overflowX: ta.style.overflowX,
    wordWrap: ta.style.wordWrap
  })

  ta.addEventListener('autosize:destroy', destroy, false)

  window.addEventListener('resize', pageResize, false)
  ta.addEventListener('input', deferredUpdate, false)
  ta.addEventListener('autosize:update', update, false)
  ta.style.overflowX = 'hidden'
  ta.style.wordWrap = 'break-word'

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

let autosize = null

// Do nothing in Node.js environment and IE8 (or lower)
if (!process.browser) {
  autosize = el => el
  autosize.destroy = el => el
  autosize.update = el => el
} else {
  autosize = (el, options) => {
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
}

export { autosize }
