import {
  followersButton,
  followsButton, getNthSearchResult,
  getNthStatus, getUrl, goBack
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`021-followers-follows.js`
  .page`http://localhost:4002`

test('shows followers and follows', async t => {
  await loginAsFoobar(t)
  await t
    .click(getNthStatus(0).find('.status-author-name'))
    .expect(getUrl()).match(/\/accounts\/3$/)
    .expect(followsButton.getAttribute('aria-label')).eql('Follows 2')
    .click(followsButton)
    .expect(getUrl()).contains('/accounts/3/follows')
    .expect(getNthSearchResult(1).innerText).contains('@foobar')
    .expect(getNthSearchResult(2).innerText).contains('@admin')
  await goBack()
  await t.expect(getUrl()).match(/\/accounts\/3$/)
    .expect(followersButton.getAttribute('aria-label')).eql('Followed by 1')
    .click(followersButton)
    .expect(getUrl()).contains('/accounts/3/followers')
    .expect(getNthSearchResult(1).innerText).contains('@admin')
})
