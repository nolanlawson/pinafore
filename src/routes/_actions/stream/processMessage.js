import { mark, stop } from '../../_utils/marks.js'
import { deleteStatus } from '../deleteStatuses.js'
import { addStatusOrNotification } from '../addStatusOrNotification.js'
import { emit } from '../../_utils/eventBus.js'
import { updateStatus } from '../updateStatus.js'

const KNOWN_EVENTS = ['update', 'delete', 'notification', 'conversation', 'filters_changed', 'status.update']

export function processMessage (instanceName, timelineName, message) {
  let { event, payload } = (message || {})
  if (!KNOWN_EVENTS.includes(event)) {
    console.warn('ignoring message from server', message)
    return
  }
  mark('processMessage')
  if (['update', 'notification', 'conversation', 'status.update'].includes(event)) {
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
      if (payload.last_status) {
        // If the last_status doesn't exist, just ignore it. There's not much we can do in that case
        addStatusOrNotification(instanceName, timelineName, payload.last_status)
      }
      break
    case 'filters_changed':
      emit('wordFiltersChanged', instanceName)
      break
    case 'status.update':
      updateStatus(instanceName, payload)
      break
  }
  stop('processMessage')
}
