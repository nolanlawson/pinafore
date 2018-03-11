import { TimelineStream } from '../_api/TimelineStream'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
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
  }
  stop('processMessage')
}

export function createStream (streamingApi, instanceName, accessToken, timelineName) {
  return new TimelineStream(streamingApi, accessToken, timelineName, {
    onMessage (msg) {
      if (msg.event !== 'update' && msg.event !== 'delete' && msg.event !== 'notification') {
        console.error("don't know how to handle event", msg)
        return
      }
      scheduleIdleTask(() => {
        processMessage(instanceName, timelineName, msg)
      })
    },
    onOpen () {
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
