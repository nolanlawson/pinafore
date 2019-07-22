import { importShowComposeDialog } from '../_components/dialog/asyncDialogs'
import { store } from '../_store/store'

export async function composeNewStatusMentioning (account) {
  store.setComposeData('dialog', { text: `@${account.acct} ` })
  const showComposeDialog = await importShowComposeDialog()
  showComposeDialog()
}
