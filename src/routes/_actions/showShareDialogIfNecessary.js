import { store } from '../_store/store'
import { importShowComposeDialog } from '../_components/dialog/asyncDialogs/importShowComposeDialog'
import { database } from '../_database/database'
import { doMediaUpload } from './media'

export async function showShareDialogIfNecessary () {
  const { isUserLoggedIn } = store.get()
  if (!isUserLoggedIn) {
    return
  }
  const data = await database.getWebShareData()
  if (!data) {
    return
  }

  // delete from IDB and import the dialog in parallel
  const [showComposeDialog] = await Promise.all([
    importShowComposeDialog(),
    database.deleteWebShareData()
  ])

  console.log('share data', data)
  const { title, text, url, file } = data

  // url is currently ignored on Android, but one can dream
  // https://web.dev/web-share-target/#verifying-shared-content
  const composeText = [title, text, url].filter(Boolean).join('\n\n')

  store.clearComposeData('dialog')
  store.setComposeData('dialog', { text: composeText })
  store.save()

  showComposeDialog()
  if (file) { // start the upload once the dialog is in view so it shows the loading spinner and everything
    /* no await */ doMediaUpload('dialog', file)
  }
}
