import { getAccountAccessibleName } from './getAccountAccessibleName'
import { htmlToPlainText } from '../_utils/htmlToPlainText'
import { POST_PRIVACY_OPTIONS } from '../_static/statuses'

function notificationText (notification, omitEmojiInDisplayNames) {
  if (!notification) {
    return
  }
  let notificationAccountDisplayName = getAccountAccessibleName(notification.account, omitEmojiInDisplayNames)
  if (notification.type === 'reblog') {
    return `${notificationAccountDisplayName} boosted your status`
  } else if (notification.type === 'favourite') {
    return `${notificationAccountDisplayName} favorited your status`
  }
}

function privacyText (visibility) {
  for (let option of POST_PRIVACY_OPTIONS) {
    if (option.key === visibility) {
      return option.label
    }
  }
}

function reblogText (reblog, account, omitEmojiInDisplayNames) {
  if (!reblog) {
    return
  }
  let accountDisplayName = getAccountAccessibleName(account, omitEmojiInDisplayNames)
  return `Boosted by ${accountDisplayName}`
}

export function getAccessibleLabelForStatus (originalAccount, account, content,
  timeagoFormattedDate, spoilerText, showContent,
  reblog, notification, visibility, omitEmojiInDisplayNames) {
  let originalAccountDisplayName = getAccountAccessibleName(originalAccount, omitEmojiInDisplayNames)

  let values = [
    notificationText(notification, omitEmojiInDisplayNames),
    originalAccountDisplayName,
    (showContent || !spoilerText) ? htmlToPlainText(content) : `Content warning: ${spoilerText}`,
    timeagoFormattedDate,
    `@${originalAccount.acct}`,
    privacyText(visibility),
    reblogText(reblog, account, omitEmojiInDisplayNames)
  ].filter(Boolean)

  return values.join(', ')
}
