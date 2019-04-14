import {
  getNthDialogOptionsOption,
  getNthStatus, getNthStatusOptionsButton,
  modalDialog, sleep, visibleModalDialog
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`032-mute-dialog.js`
  .page`http://localhost:4002`

test('Can open the mute dialog twice', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getNthStatus(1).exists).ok({ timeout: 30000 })
    .hover(getNthStatus(1))
    .click(getNthStatusOptionsButton(1))
    .click(getNthDialogOptionsOption(3))
    .expect(visibleModalDialog.innerText).contains('Mute notifications')
  await sleep(500)
  await t
    .pressKey('esc')
    .expect(modalDialog.exists).notOk()
  await sleep(500)
  await t
    .click(getNthStatusOptionsButton(1))
    .click(getNthDialogOptionsOption(3))
    .expect(visibleModalDialog.innerText).contains('Mute notifications')
  await sleep(500)
  await t
    .pressKey('esc')
    .expect(modalDialog.exists).notOk()
})
