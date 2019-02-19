import { importShowReportDialog } from '../_components/dialog/asyncDialogs'

export async function reportStatusOrAccount ({ status, account }) {
  let showReportDialog = await importShowReportDialog()
  showReportDialog({ status, account })
}
