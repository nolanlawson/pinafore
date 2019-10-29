import { importShowReportDialog } from '../_components/dialog/asyncDialogs/importShowReportDialog.js'

export async function reportStatusOrAccount ({ status, account }) {
  const showReportDialog = await importShowReportDialog()
  showReportDialog({ status, account })
}
