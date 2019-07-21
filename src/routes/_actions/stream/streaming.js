import { TimelineStream } from '../../_api/stream/TimelineStream'
import { processMessage } from './processMessage'
import { fillStreamingGap } from './fillStreamingGap'

export function createStream (api, instanceName, accessToken, timelineName, firstStatusId, firstNotificationId) {
  console.log(`streaming ${instanceName} ${timelineName}: createStream`, 'firstStatusId', firstStatusId,
    'firstNotificationId', firstNotificationId)

  const onMessage = message => {
    processMessage(instanceName, timelineName, message)
  }

  const onOpen = () => {
    console.log(`streaming ${instanceName} ${timelineName}: opened`)
    if (firstStatusId) {
      /* no await */ fillStreamingGap(instanceName, accessToken, timelineName, firstStatusId)
    }
    if (firstNotificationId) {
      // special case - the home timeline also applies to notifications, so we handle that here if necessary
      /* no await */ fillStreamingGap(instanceName, accessToken, 'notifications', firstNotificationId)
    }
  }

  const onClose = () => {
    console.log(`streaming ${instanceName} ${timelineName}: closed`)
  }

  const onReconnect = () => {
    console.log(`streaming ${instanceName} ${timelineName}: reconnected`)
  }

  return new TimelineStream(api, accessToken, timelineName)
    .on('message', onMessage)
    .on('open', onOpen)
    .on('close', onClose)
    .on('reconnect', onReconnect)
}
