import { getAccountAccessibleName } from './getAccountAccessibleName'
import { POST_PRIVACY_OPTIONS } from '../_static/statuses'

function getNotificationText (notification, omitEmojiInDisplayNames) {
  if (!notification) {
    return
  }
  const notificationAccountDisplayName = getAccountAccessibleName(notification.account, omitEmojiInDisplayNames)
  if (notification.type === 'reblog') {
    return `${notificationAccountDisplayName} boosted your status`
  } else if (notification.type === 'favourite') {
    return `${notificationAccountDisplayName} favorited your status`
  }
}

function getPrivacyText (visibility) {
  for (const option of POST_PRIVACY_OPTIONS) {
    if (option.key === visibility) {
      return option.label
    }
  }
}

function getReblogText (reblog, account, omitEmojiInDisplayNames) {
  if (!reblog) {
    return
  }
  const accountDisplayName = getAccountAccessibleName(account, omitEmojiInDisplayNames)
  return `Boosted by ${accountDisplayName}`
}

function cleanupText (text) {
  return text.replace(/\s+/g, ' ').trim()
}

export function getAccessibleLabelForStatus (originalAccount, account, plainTextContent,
  timeagoFormattedDate, spoilerText, showContent,
  reblog, notification, visibility, omitEmojiInDisplayNames,
  disableLongAriaLabels) {
  const originalAccountDisplayName = getAccountAccessibleName(originalAccount, omitEmojiInDisplayNames)
  const contentTextToShow = (showContent || !spoilerText)
    ? cleanupText(plainTextContent)
    : `Content warning: ${cleanupText(spoilerText)}`
  const privacyText = getPrivacyText(visibility)

  if (disableLongAriaLabels) {
    // Long text can crash NVDA; allow users to shorten it like we had it before.
    // https://github.com/nolanlawson/pinafore/issues/694
    return `${privacyText} status by ${originalAccountDisplayName}`
  }

  const values = [
    getNotificationText(notification, omitEmojiInDisplayNames),
    originalAccountDisplayName,
    contentTextToShow,
    timeagoFormattedDate,
    `@${originalAccount.acct}`,
    privacyText,
    getReblogText(reblog, account, omitEmojiInDisplayNames)
  ].filter(Boolean)

  return values.join(', ')
}
