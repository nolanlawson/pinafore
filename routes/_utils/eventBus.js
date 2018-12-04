import EventEmitter from 'events-light'

const eventBus = new EventEmitter()

if (process.browser && process.env.NODE_ENV !== 'production') {
  window.eventBus = eventBus
}

export function on (eventName, component, method) {
  let callback = method.bind(component)
  eventBus.on(eventName, callback)
  component.on('destroy', () => {
    eventBus.removeListener(eventName, callback)
  })
}

export const emit = eventBus.emit.bind(eventBus)
