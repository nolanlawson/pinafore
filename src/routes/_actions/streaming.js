import { TimelineStream } from '../_api/stream/TimelineStream'
import { mark, stop } from '../_utils/marks'
import { deleteStatus } from './deleteStatuses'
import { addStatusOrNotification } from './addStatusOrNotification'

const KNOWN_EVENTS = ['update', 'delete', 'notification', 'conversation']

function processMessage (instanceName, timelineName, message) {
  mark('processMessage')
  let { event, payload } = message
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
  }
  stop('processMessage')
}

export function createStream (streamingApi, instanceName, accessToken, timelineName, onOpenOrReconnect) {
  return new TimelineStream(streamingApi, accessToken, timelineName)
    .on('message', msg => {
      if (!KNOWN_EVENTS.includes(msg.event)) {
        console.error("don't know how to handle event", msg)
        return
      }
      processMessage(instanceName, timelineName, msg)
    })
    .on('open', () => {
      if (onOpenOrReconnect) {
        onOpenOrReconnect()
      }
      console.log(`streaming: opened stream for timeline`, timelineName)
    })
    .on('close', () => {
      console.log(`streaming: closed stream for timeline`, timelineName)
    })
    .on('reconnect', () => {
      if (onOpenOrReconnect) {
        onOpenOrReconnect()
      }
      console.log(`streaming: reconnected stream for timeline`, timelineName)
    })
}
