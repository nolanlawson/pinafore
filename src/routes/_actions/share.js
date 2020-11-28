import { toast } from '../_components/toast/toast'
import { statusHtmlToPlainText } from '../_utils/statusHtmlToPlainText'
import { formatIntl } from '../_utils/formatIntl'

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
