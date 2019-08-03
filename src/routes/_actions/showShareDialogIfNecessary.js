import { store } from '../_store/store'
import { importShowComposeDialog } from '../_components/dialog/asyncDialogs'

export async function showShareDialogIfNecessary () {
  const { isUserLoggedIn, openShareDialog } = store.get()
  store.set({ openShareDialog: false })
  if (isUserLoggedIn && openShareDialog) {
    const showComposeDialog = await importShowComposeDialog()
    showComposeDialog()
  }
}
