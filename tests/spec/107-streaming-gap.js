import { loginAsFoobar } from '../roles'
import {
  getNthStatus, homeNavButton, localTimelineNavButton, sleep
} from '../utils'
import {
  postAs
} from '../serverActions'

fixture`107-streaming-gap.js`
  .page`http://localhost:4002`

test('fills in a status posted while away from timeline', async t => {
  let timeout = 30000

  await loginAsFoobar(t)
  await t
    .click(localTimelineNavButton)
    .expect(getNthStatus(0).exists).ok({ timeout })
    .hover(getNthStatus(0))
  await postAs('admin', 'heyo')
  await t.expect(getNthStatus(0).innerText).contains('heyo', { timeout })
    .click(homeNavButton)
    .hover(getNthStatus(0))
  await postAs('admin', 'posted this while you were away!')
  await t.expect(getNthStatus(0).innerText).contains('posted this while you were away!', { timeout })
    .click(localTimelineNavButton)
    .expect(getNthStatus(0).innerText).contains('posted this while you were away!', { timeout })
    .expect(getNthStatus(1).innerText).contains('heyo', { timeout })
  await sleep(5000)
  await postAs('admin', 'posted this while you were watching')
  await t.expect(getNthStatus(0).innerText).contains('posted this while you were watching', { timeout })
})
