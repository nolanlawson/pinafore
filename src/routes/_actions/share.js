import { toast } from '../_components/toast/toast'
import { statusHtmlToPlainText } from '../_utils/statusHtmlToPlainText'

export async function shareStatus (status) {
  try {
    await navigator.share({
      title: status.spoiler_text || undefined,
      text: statusHtmlToPlainText(status.content, status.mentions),
      url: status.url
    })
  } catch (e) {
    toast.say(`Unable to share: ` + (e.message || ''))
  }
}
