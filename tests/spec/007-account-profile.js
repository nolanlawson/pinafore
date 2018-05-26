import { Selector as $ } from 'testcafe'
import {
  accountProfileFollowButton,
  accountProfileFollowedBy, accountProfileName, accountProfileUsername, getUrl,
  validateTimeline
} from '../utils'
import { loginAsFoobar } from '../roles'
import { quuxStatuses } from '../fixtures'

fixture`007-account-profile.js`
  .page`http://localhost:4002`

test('shows account profile', async t => {
  await loginAsFoobar(t)
  await t
    .click($('.status-author-name').withText(('quux')))
    .expect(getUrl()).contains('/accounts/3')
    .expect(accountProfileName.innerText).contains('quux')
    .expect(accountProfileUsername.innerText).contains('@quux')
    .expect(accountProfileFollowedBy.innerText).match(/follows you/i)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Follow')
    .expect(accountProfileFollowButton.getAttribute('aria-pressed')).eql('false')
})

test('shows account profile 2', async t => {
  await loginAsFoobar(t)
  await t
    .click($('.status-author-name').withText(('admin')))
    .expect(getUrl()).contains('/accounts/1')
    .expect(accountProfileName.innerText).contains('admin')
    .expect(accountProfileUsername.innerText).contains('@admin')
    .expect(accountProfileFollowedBy.innerText).match(/follows you/i)
    .expect(accountProfileFollowButton.getAttribute('aria-label')).eql('Unfollow')
    .expect(accountProfileFollowButton.getAttribute('aria-pressed')).eql('true')
})

test('shows account profile 3', async t => {
  await loginAsFoobar(t)
  await t
    .click($('.mention').withText(('foobar')))
    .expect(getUrl()).contains('/accounts/2')
    .expect(accountProfileName.innerText).contains('foobar')
    .expect(accountProfileUsername.innerText).contains('@foobar')
    // can't follow or be followed by your own account
    .expect(accountProfileFollowedBy.innerText).eql('')
    .expect($('.account-profile .account-profile-follow').innerText).eql('')
})

test('shows account profile statuses', async t => {
  await loginAsFoobar(t)
  await t
    .click($('.status-author-name').withText(('quux')))
    .expect(getUrl()).contains('/accounts/3')
    .expect($('.pinned-statuses .status-article').getAttribute('aria-setsize')).eql('2')
    .expect($('.pinned-statuses .status-article').getAttribute('aria-posinset')).eql('0')
    .expect($('.timeline .status-article').getAttribute('aria-posinset')).eql('0')
  await validateTimeline(t, quuxStatuses)
  await t.expect($('.timeline .status-article').getAttribute('aria-setsize')).eql('27')
})
