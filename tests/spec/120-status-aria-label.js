import { loginAsFoobar } from '../roles'
import { getNthStatus } from '../utils'
import { postEmptyStatusWithMediaAs } from '../serverActions'

fixture`120-status-aria-label.js`
  .page`http://localhost:4002`

test('aria-labels for statuses with no content text', async t => {
  await postEmptyStatusWithMediaAs('foobar', 'kitten1.jpg', 'kitteh')
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .expect(getNthStatus(0).getAttribute('aria-label')).match(
      /foobar, (.+ ago|just now), @foobar, Public/i
    )
})
