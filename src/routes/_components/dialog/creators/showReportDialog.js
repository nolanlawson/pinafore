import ReportDialog from '../components/ReportDialog.html'
import { showDialog } from './showDialog'
import { formatIntl } from '../../../_utils/formatIntl'

export default function showReportDialog ({ account, status }) {
  const label = formatIntl('intl.reportAccount', { account: `@${account.acct}` })
  return showDialog(ReportDialog, {
    label,
    title: label,
    account,
    status
  })
}
