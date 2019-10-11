// see also SlideInOut.html
// The goal of this module is so that other elements can respond to slide in/out events
// and animate themselves accordingly

import { on } from '../_utils/eventBus'

export function registerSlideInOutListener (component, nodes) {
  on('slide-in-start', component, height => {
    nodes.forEach(node => {
      node.style.transform = `translateY(-${height}px)`
      requestAnimationFrame(() => {
        const onTransitionEnd = () => {
          node.style.transition = ''
          node.removeEventListener('transitionend', onTransitionEnd)
        }
        node.addEventListener('transitionend', onTransitionEnd)
        node.style.transition = 'transform 0.333s ease-in-out'
        node.style.transform = 'translateY(0)'
      })
    })
  })
}
