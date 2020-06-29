// Copied from
// https://github.com/nolanlawson/emoji-picker-element/blob/04f490a/src/picker/utils/testColorEmojiSupported.js

import { FONT_FAMILY } from '../_static/fonts'

const getTextFeature = (text, color) => {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1

    const ctx = canvas.getContext('2d')
    ctx.textBaseline = 'top'
    ctx.font = `100px ${FONT_FAMILY}`
    ctx.fillStyle = color
    ctx.scale(0.01, 0.01)
    ctx.fillText(text, 0, 0)

    return ctx.getImageData(0, 0, 1, 1).data
  } catch (e) { /* ignore, return undefined */ }
}

const compareFeatures = (feature1, feature2) => {
  const feature1Str = [...feature1].join(',')
  const feature2Str = [...feature2].join(',')
  return feature1Str === feature2Str && feature1Str !== '0,0,0,0'
}

export function testColorEmojiSupported (text) {
  // Render white and black and then compare them to each other and ensure they're the same
  // color, and neither one is black. This shows that the emoji was rendered in color.
  const feature1 = getTextFeature(text, '#000')
  const feature2 = getTextFeature(text, '#fff')

  const supported = feature1 && feature2 && compareFeatures(feature1, feature2)
  if (!supported) {
    console.log('Filtered unsupported emoji via color test', text)
  }
  return supported
}
