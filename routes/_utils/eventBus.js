import EventEmitter from 'events'

const eventBus = new EventEmitter()

// we need enough 'postedStatus' listeners for each
// visible status in a timeline
eventBus.setMaxListeners(100)

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
