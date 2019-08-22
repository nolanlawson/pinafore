const colorsToUrls = new Map()
let canvas
let context

export function convertCssPropertyToDataUrl (prop) {
  const color = getComputedStyle(document.documentElement).getPropertyValue(prop)
  let url = colorsToUrls.get(color)
  if (!url) {
    if (!canvas) {
      canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      context = canvas.getContext('2d')
    }
    context.fillStyle = color
    context.rect(0, 0, 1, 1)
    context.fill()
    url = canvas.toDataURL()
    colorsToUrls.set(color, url)
  }
  return url
}
