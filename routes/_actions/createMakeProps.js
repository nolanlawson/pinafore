import { database } from '../_database/database'

async function getNotification (instanceName, timelineType, timelineValue, itemId) {
  return {
    timelineType,
    timelineValue,
    notification: await database.getNotification(instanceName, itemId)
  }
}

async function getStatus (instanceName, timelineType, timelineValue, itemId) {
  return {
    timelineType,
    timelineValue,
    status: await database.getStatus(instanceName, itemId)
  }
}

export function createMakeProps (instanceName, timelineType, timelineValue) {
  let taskCount = 0
  let pending = []

  // The worker-powered indexeddb promises can resolve in arbitrary order,
  // causing the timeline to load in a jerky way. With this function, we
  // wait for all promises to resolve before resolving them all in one go.
  function awaitAllTasksComplete () {
    return new Promise(resolve => {
      taskCount--
      pending.push(resolve)
      if (taskCount === 0) {
        pending.forEach(_ => _())
        pending = []
      }
    })
  }

  return (itemId) => {
    taskCount++
    let promise = timelineType === 'notifications'
      ? getNotification(instanceName, timelineType, timelineValue, itemId)
      : getStatus(instanceName, timelineType, timelineValue, itemId)

    return promise.then(res => {
      return awaitAllTasksComplete().then(() => res)
    })
  }
}
