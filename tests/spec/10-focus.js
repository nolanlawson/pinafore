import {
  getNthStatus, scrollToStatus, closeDialogButton, modalDialogContents, getActiveElementClass, goBack, getUrl
} from '../utils'
import { foobarRole } from '../roles'

fixture`09-threads.js`
  .page`http://localhost:4002`

test('modal preserves focus', async t => {
  await t.useRole(foobarRole)
  await scrollToStatus(t, 9)
  await t.click(getNthStatus(9).find('.play-video-button'))
    .click(closeDialogButton)
    .expect(modalDialogContents.exists).notOk()
    .expect(getActiveElementClass()).eql('play-video-button')
})

test('timeline preserves focus', async t => {
  await t.useRole(foobarRole)
    .click(getNthStatus(0))
    .expect(getUrl()).contains('/statuses/99549266679020981')

  await goBack()
  await t.expect(getActiveElementClass()).eql('status-article status-in-timeline')
})
