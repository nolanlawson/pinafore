// via https://unpkg.com/is-emoji-supported@0.0.5/dist/esm/is-emoji-supported.js

import { COUNTRY_FLAG_FONT_FAMILY, FONT_FAMILY } from '../../_static/fonts.js'

/**
 * @var {Object} cache
 */
let cache = new Map()

/**
 * Check if emoji is supported with cache
 *
 * @params {string} unicode
 * @returns {boolean}
 */
function isEmojiSupported (unicode) {
  if (cache.has(unicode)) {
    return cache.get(unicode)
  }
  const supported = isSupported(unicode)
  cache.set(unicode, supported)
  return supported
}

/**
 * Request to handle cache directly
 *
 * @params {Map} store
 */
function setCacheHandler (store) {
  cache = store
}

/**
 * Check if the two pixels parts are perfectly the sames
 *
 * @params {string} unicode
 * @returns {boolean}
 */
const isSupported = (function () {
  let ctx = null

  const CANVAS_HEIGHT = 25
  const CANVAS_WIDTH = 20

  function createContext() {
    if (ctx) {
      return
    }
    ctx = document.createElement('canvas').getContext('2d')
    const textSize = Math.floor(CANVAS_HEIGHT / 2)
    // Initialize convas context
    ctx.font = textSize + `px PinaforeEmoji`
    ctx.textBaseline = 'top'
    ctx.canvas.width = CANVAS_WIDTH * 2
    ctx.canvas.height = CANVAS_HEIGHT
  }

  return function (unicode) {
    createContext()
    ctx.clearRect(0, 0, CANVAS_WIDTH * 2, CANVAS_HEIGHT)
    // Draw in red on the left
    ctx.fillStyle = '#FF0000'
    ctx.fillText(unicode, 0, 22)
    // Draw in blue on right
    ctx.fillStyle = '#0000FF'
    ctx.fillText(unicode, CANVAS_WIDTH, 22)
    const a = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data
    const count = a.length
    let i = 0
    // Search the first visible pixel
    // eslint-disable-next-line no-empty
    for (; i < count && !a[i + 3]; i += 4) {}
    // No visible pixel
    if (i >= count) {
      return false
    }
    // Emoji has immutable color, so we check the color of the emoji in two different colors
    // the result show be the same.
    const x = CANVAS_WIDTH + ((i / 4) % CANVAS_WIDTH)
    const y = Math.floor(i / 4 / CANVAS_WIDTH)
    const b = ctx.getImageData(x, y, 1, 1).data
    if (a[i] !== b[0] || a[i + 2] !== b[2]) {
      return false
    }
    // Some emojis are a contraction of different ones, so if it's not
    // supported, it will show multiple characters
    if (ctx.measureText(unicode).width >= CANVAS_WIDTH) {
      return false
    }
    // Supported
    return true
  }
})()

export { isEmojiSupported, setCacheHandler }
