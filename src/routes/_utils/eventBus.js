import eventsLightPackage from 'events-light'
const { EventEmitter } = eventsLightPackage

export const eventBus = new EventEmitter()

if (process.browser) {
  window.__eventBus = eventBus
}

export function on (eventName, component, method) {
  if (typeof method === 'undefined') {
    method = component
    component = undefined
  }
  const callback = method.bind(component)
  eventBus.on(eventName, callback)
  if (component) {
    component.on('destroy', () => {
      eventBus.removeListener(eventName, callback)
    })
  }
}

export const emit = eventBus.emit.bind(eventBus)
