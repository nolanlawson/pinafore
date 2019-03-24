import ReportDialog from '../components/ReportDialog.html'
import { showDialog } from '../lifecycle/showDialog'

export default function showReportDialog ({ account, status }) {
  return showDialog(ReportDialog, {
    label: 'Report dialog',
    title: `Report @${account.acct}`,
    account,
    status
  })
}
