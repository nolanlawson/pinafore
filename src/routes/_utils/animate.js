// Lightweight polyfill for web animations API element.animate()
// This is good enough for my use case, although not a full polyfill
// of the entire API

// via https://stackoverflow.com/a/15710692
function hashCode (s) {
  return s.split('')
    .reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
}

function generateCss (id, animations) {
  let keyframes = animations.map(({ properties }, i) => (
    `@keyframes keyframe-${id}-${i} {
      ${properties.map((obj, i) => (`${Math.round(100 * i / (properties.length - 1))}% {
          ${Object.keys(obj).map(key => `${key}: ${obj[key]};`).join('')}
        }`
    )).join('')}
    }`
  ))

  let animationCss = `.${id} {
    animation: ${animations.map(({ options }, i) => {
    return `keyframe-${id}-${i} ${options.duration}ms ${options.easing}`
  }).join(',')};
  }`

  return keyframes + animationCss
}

export function animate (el, animations) {
  if (typeof el.animate === 'function') {
    return animations
      .map(({ properties, options }) => el.animate(properties, options))
      .map(anim => anim.play())
  }

  let hash = hashCode(JSON.stringify(animations))
  let id = `anim-${hash}`

  if (!document.getElementById(id)) {
    let style = document.createElement('style')
    style.id = id
    style.textContent = generateCss(id, animations)
    document.head.appendChild(style)
  }

  requestAnimationFrame(() => {
    el.classList.add(id)
    let wait = Math.max.apply(Math, animations.map(({ options }) => options.duration))
    setTimeout(() => {
      requestAnimationFrame(() => {
        el.classList.remove(id)
      })
    }, wait)
  })
}
