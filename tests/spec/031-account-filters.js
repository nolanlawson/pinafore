import {
  accountProfileFilterMedia, accountProfileFilterStatuses,
  accountProfileFilterStatusesAndReplies,
  avatarInComposeBox,
  getNthPinnedStatus, getNthStatus,
  getUrl
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`031-account-filters.js`
  .page`http://localhost:4002`

test('Basic account filters test', async t => {
  await loginAsFoobar(t)
  await t
    .click(avatarInComposeBox)
    .expect(getUrl()).contains('/accounts/2')
    .expect(getNthPinnedStatus(1).innerText).contains('this is unlisted')
    .expect(getNthStatus(1).innerText).contains('this is unlisted')
    .click(accountProfileFilterStatusesAndReplies)
    .expect(getUrl()).contains('/accounts/2/with_replies')
    .expect(getNthPinnedStatus(1).exists).notOk()
    .expect(getNthStatus(1).innerText).contains('this is unlisted')
    .click(accountProfileFilterMedia)
    .expect(getNthPinnedStatus(1).exists).notOk()
    .expect(getNthStatus(1).innerText).contains('kitten CW')
    .click(accountProfileFilterStatuses)
    .expect(getUrl()).contains('/accounts/2')
    .expect(getNthPinnedStatus(1).innerText).contains('this is unlisted')
    .expect(getNthStatus(1).innerText).contains('this is unlisted')
})
