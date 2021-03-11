import { mark, stop } from '../../_utils/marks'
import { deleteStatus } from '../deleteStatuses'
import { addStatusOrNotification } from '../addStatusOrNotification'
import { emit } from '../../_utils/eventBus'

const KNOWN_EVENTS = ['update', 'delete', 'notification', 'conversation', 'filters_changed']

export function processMessage (instanceName, timelineName, message) {
  let { event, payload } = (message || {})
  if (!KNOWN_EVENTS.includes(event)) {
    console.warn('ignoring message from server', message)
    return
  }
  mark('processMessage')
  if (['update', 'notification', 'conversation'].includes(event)) {
    payload = JSON.parse(payload) // only these payloads are JSON-encoded for some reason
  }

  switch (event) {
    case 'delete':
      deleteStatus(instanceName, payload)
      break
    case 'update':
      addStatusOrNotification(instanceName, timelineName, payload)
      break
    case 'notification':
      addStatusOrNotification(instanceName, 'notifications', payload)
      if (payload.type === 'mention') {
        addStatusOrNotification(instanceName, 'notifications/mentions', payload)
      }
      break
    case 'conversation':
      // This is a hack in order to mostly fit the conversation model into
      // a timeline of statuses. To have a clean implementation we would need to
      // reproduce what is done for statuses for the conversation.
      //
      // It will add new DMs as new conversations instead of updating existing threads
      addStatusOrNotification(instanceName, timelineName, payload.last_status)
      break
    case 'filters_changed':
      emit('wordFiltersChanged', instanceName)
      break
  }
  stop('processMessage')
}
