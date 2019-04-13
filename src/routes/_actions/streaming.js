import { TimelineStream } from '../_api/TimelineStream'
import { mark, stop } from '../_utils/marks'
import { deleteStatus } from './deleteStatuses'
import { addStatusOrNotification } from './addStatusOrNotification'

function processMessage (instanceName, timelineName, message) {
  mark('processMessage')
  let { event, payload } = message
  switch (event) {
    case 'delete':
      deleteStatus(instanceName, payload)
      break
    case 'update':
      addStatusOrNotification(instanceName, timelineName, JSON.parse(payload))
      break
    case 'notification':
      addStatusOrNotification(instanceName, 'notifications', JSON.parse(payload))
      break
    case 'conversation':
      // This is a hack in order to mostly fit the conversation model into
      // a timeline of statuses. To have a clean implementation we would need to
      // reproduce what is done for statuses for the conversation.
      //
      // It will add new DMs as new conversations instead of updating existing threads
      addStatusOrNotification(instanceName, timelineName, JSON.parse(payload).last_status)
      break
  }
  stop('processMessage')
}

export function createStream (streamingApi, instanceName, accessToken,
  timelineName, onOpenStream) {
  return new TimelineStream(streamingApi, accessToken, timelineName, {
    onMessage (msg) {
      if (
        msg.event !== 'update' &&
        msg.event !== 'delete' &&
        msg.event !== 'notification' &&
        msg.event !== 'conversation'
      ) {
        console.error("don't know how to handle event", msg)
        return
      }
      processMessage(instanceName, timelineName, msg)
    },
    onOpen () {
      if (onOpenStream) {
        onOpenStream()
      }
      console.log('opened stream for timeline', timelineName)
    },
    onClose () {
      console.log('closed stream for timeline', timelineName)
    },
    onReconnect () {
      console.log('reconnected stream for timeline', timelineName)
    }
  })
}
