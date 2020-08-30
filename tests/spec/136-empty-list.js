import {
  getNthStatus, sleep,
  timeline
} from '../utils'
import { loginAsFoobar } from '../roles'
import { postStatusWithMediaAs } from '../serverActions'

fixture`136-empty-list.js`
  .page`http://localhost:4002`

test('An empty list can become non-empty as results stream in', async t => {
  await loginAsFoobar(t)
  await t
    .expect(getNthStatus(1).exists).ok()
    .navigateTo('/tags/sweetkitty')
    .expect(timeline.innerText).contains('Nothing to show.')

  await sleep(500)
  await postStatusWithMediaAs('quux', 'look at this sweet kitty #sweetkitty', 'kitten2.jpg', 'hello kitty')
  await t
    .expect(getNthStatus(1).innerText).contains('look at this sweet kitty', { timeout: 20000 })
})
