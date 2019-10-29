import { importShowMuteDialog } from '../_components/dialog/asyncDialogs/importShowMuteDialog.js'
import { setAccountMuted } from './mute'

export async function toggleMute (account, mute) {
  if (mute) {
    (await importShowMuteDialog())(account)
  } else {
    await setAccountMuted(account.id, mute, /* notifications */ false, /* toastOnSuccess */ true)
  }
}
