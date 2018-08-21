import EventEmitter from 'events'

const eventBus = new EventEmitter()

// We need enough 'postedStatus' listeners for each
// visible status in a timeline. Some statuses may hang around
// for a bit because they're destroyed lazily via rIC.
eventBus.setMaxListeners(200)

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
