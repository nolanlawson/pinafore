import MediaFocalPointDialog from '../components/MediaEditDialog.html'
import { showDialog } from './showDialog.js'

export default function showMediaEditDialog (realm, index, type) {
  return showDialog(MediaFocalPointDialog, {
    label: 'intl.editMedia',
    title: 'intl.editMedia',
    realm,
    index,
    type
  })
}
