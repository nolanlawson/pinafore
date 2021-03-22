import { getAccountAccessibleName } from './getAccountAccessibleName'
import { POST_PRIVACY_OPTIONS } from '../_static/statuses'
import { formatIntl } from '../_utils/formatIntl'

function getNotificationText (notification, omitEmojiInDisplayNames) {
  if (!notification) {
    return
  }
  const notificationAccountDisplayName = getAccountAccessibleName(notification.account, omitEmojiInDisplayNames)
  if (notification.type === 'reblog') {
    return formatIntl('intl.accountRebloggedYou', { account: notificationAccountDisplayName })
  } else if (notification.type === 'favourite') {
    return formatIntl('intl.accountFavoritedYou', { account: notificationAccountDisplayName })
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
  return formatIntl('intl.rebloggedByAccount', { account: accountDisplayName })
}

function cleanupText (text) {
  return text.replace(/\s+/g, ' ').trim()
}

export function getAccessibleLabelForStatus (originalAccount, account, plainTextContent,
  shortInlineFormattedDate, spoilerText, showContent,
  reblog, notification, visibility, omitEmojiInDisplayNames,
  disableLongAriaLabels, showMedia, showPoll) {
  const originalAccountDisplayName = getAccountAccessibleName(originalAccount, omitEmojiInDisplayNames)
  const contentTextToShow = (showContent || !spoilerText)
    ? cleanupText(plainTextContent)
    : formatIntl('intl.contentWarningContent', { spoiler: cleanupText(spoilerText) })
  const mediaTextToShow = showMedia && 'intl.hasMedia'
  const pollTextToShow = showPoll && 'intl.hasPoll'
  const privacyText = getPrivacyText(visibility)

  if (disableLongAriaLabels) {
    // Long text can crash NVDA; allow users to shorten it like we had it before.
    // https://github.com/nolanlawson/pinafore/issues/694
    return formatIntl('intl.shortStatusLabel', { privacy: privacyText, account: originalAccountDisplayName })
  }

  const values = [
    getNotificationText(notification, omitEmojiInDisplayNames),
    originalAccountDisplayName,
    contentTextToShow,
    mediaTextToShow,
    pollTextToShow,
    shortInlineFormattedDate,
    `@${originalAccount.acct}`,
    privacyText,
    getReblogText(reblog, account, omitEmojiInDisplayNames)
  ].filter(Boolean)

  return values.join(', ')
}
