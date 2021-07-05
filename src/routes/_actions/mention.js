import { importShowComposeDialog } from '../_components/dialog/asyncDialogs/importShowComposeDialog.js'
import { store } from '../_store/store.js'

export async function composeNewStatusMentioning (account) {
  store.setComposeData('dialog', { text: `@${account.acct} ` })
  const showComposeDialog = await importShowComposeDialog()
  showComposeDialog()
}
