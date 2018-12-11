import { importShowCopyDialog } from '../_components/dialog/asyncDialogs'
import { toast } from '../_utils/toast'

export async function copyText (text) {
  if (navigator.clipboard) { // not supported in all browsers
    try {
      await navigator.clipboard.writeText(text)
      toast.say('Copied to clipboard')
      return
    } catch (e) {
      console.error(e)
    }
  }

  let showCopyDialog = await importShowCopyDialog()
  showCopyDialog(text)
}
