import { statusHtmlToPlainText } from '../_utils/statusHtmlToPlainText.js'
import { importShowComposeDialog } from '../_components/dialog/asyncDialogs/importShowComposeDialog.js'
import { doDeleteStatus } from './delete.js'
import { store } from '../_store/store.js'

export async function deleteAndRedraft (status) {
  const deleteStatusPromise = doDeleteStatus(status.id)
  const dialogPromise = importShowComposeDialog()
  const deletedStatus = await deleteStatusPromise

  store.setComposeData('dialog', {
    text: deletedStatus.text || statusHtmlToPlainText(status.content, status.mentions),
    contentWarningShown: !!status.spoiler_text,
    contentWarning: status.spoiler_text || '',
    postPrivacy: status.visibility,
    media: status.media_attachments && status.media_attachments.map(_ => ({
      description: _.description || '',
      data: _
    })),
    inReplyToId: status.in_reply_to_id,
    // note that for polls there is no real way to preserve the original expiry
    poll: status.poll && {
      multiple: !!status.poll.multiple,
      options: (status.poll.options || []).map(option => option.title)
    },
    sensitive: !!status.sensitive
  })
  const showComposeDialog = await dialogPromise
  showComposeDialog()
}
