import { toast } from '../_components/toast/toast.js'
import { statusHtmlToPlainText } from '../_utils/statusHtmlToPlainText.js'
import { formatIntl } from '../_utils/formatIntl.js'

export async function shareStatus (status) {
  try {
    await navigator.share({
      title: status.spoiler_text || undefined,
      text: statusHtmlToPlainText(status.content, status.mentions),
      url: status.url
    })
  } catch (e) {
    /* no await */ toast.say(formatIntl('intl.unableToShare', { error: (e.message || '') }))
  }
}
