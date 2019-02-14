import { store } from '../_store/store'
import { importShowComposeDialog } from '../_components/dialog/asyncDialogs'

export async function showShareDialogIfNecessary () {
  let { isUserLoggedIn, openShareDialog } = store.get()
  store.set({ openShareDialog: false })
  if (isUserLoggedIn && openShareDialog) {
    let showComposeDialog = await importShowComposeDialog()
    showComposeDialog()
  }
}
