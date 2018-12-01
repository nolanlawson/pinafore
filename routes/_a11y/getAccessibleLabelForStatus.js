import { getAccountAccessibleName } from './getAccountAccessibleName'
import { POST_PRIVACY_OPTIONS } from '../_static/statuses'
import { htmlToPlainText } from '../_utils/htmlToPlainText'

const MAX_TEXT_LENGTH = 150

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

// Works around a bug in NVDA where it may crash if the string is too long
// https://github.com/nolanlawson/pinafore/issues/694
function truncateTextForSRs (text) {
  if (text.length > MAX_TEXT_LENGTH) {
    text = text.substring(0, MAX_TEXT_LENGTH)
    text = text.replace(/\S+$/, '') + '…'
  }
  return text.replace(/\s+/g, ' ').trim()
}

export function getAccessibleLabelForStatus (originalAccount, account, content,
  timeagoFormattedDate, spoilerText, showContent,
  reblog, notification, visibility, omitEmojiInDisplayNames) {
  let originalAccountDisplayName = getAccountAccessibleName(originalAccount, omitEmojiInDisplayNames)
  let contentTextToShow = (showContent || !spoilerText)
    ? truncateTextForSRs(htmlToPlainText(content))
    : `Content warning: ${truncateTextForSRs(spoilerText)}`

  let values = [
    notificationText(notification, omitEmojiInDisplayNames),
    originalAccountDisplayName,
    contentTextToShow,
    timeagoFormattedDate,
    `@${originalAccount.acct}`,
    privacyText(visibility),
    reblogText(reblog, account, omitEmojiInDisplayNames)
  ].filter(Boolean)

  return values.join(', ')
}
