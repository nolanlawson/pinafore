export function createStatusOrNotificationUuid (currentInstance, timelineType, timelineValue, notificationId, statusId) {
  return `${currentInstance}/${timelineType}/${timelineValue}/${notificationId || ''}/${statusId || ''}`
}
