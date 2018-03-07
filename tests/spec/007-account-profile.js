import { Selector as $ } from 'testcafe'
import { getUrl, validateTimeline } from '../utils'
import { foobarRole } from '../roles'
import { quuxStatuses } from '../fixtures'

fixture`007-account-profile.js`
  .page`http://localhost:4002`

test('shows account profile', async t => {
  await t.useRole(foobarRole)
    .click($('.status-author-name').withText(('quux')))
    .expect(getUrl()).contains('/accounts/3')
    .expect($('.account-profile .account-profile-name').innerText).contains('quux')
    .expect($('.account-profile .account-profile-username').innerText).contains('@quux')
    .expect($('.account-profile .account-profile-followed-by').innerText).match(/follows you/i)
    .expect($('.account-profile .account-profile-follow button').getAttribute('aria-label')).eql('Follow')
    .expect($('.account-profile .account-profile-follow button').getAttribute('aria-pressed')).eql('false')
})

test('shows account profile 2', async t => {
  await t.useRole(foobarRole)
    .click($('.status-author-name').withText(('admin')))
    .expect(getUrl()).contains('/accounts/1')
    .expect($('.account-profile .account-profile-name').innerText).contains('admin')
    .expect($('.account-profile .account-profile-username').innerText).contains('@admin')
    .expect($('.account-profile .account-profile-followed-by').innerText).match(/follows you/i)
    .expect($('.account-profile .account-profile-follow button').getAttribute('aria-label')).eql('Unfollow')
    .expect($('.account-profile .account-profile-follow button').getAttribute('aria-pressed')).eql('true')
})

test('shows account profile 3', async t => {
  await t.useRole(foobarRole)
    .click($('.mention').withText(('foobar')))
    .expect(getUrl()).contains('/accounts/2')
    .expect($('.account-profile .account-profile-name').innerText).contains('foobar')
    .expect($('.account-profile .account-profile-username').innerText).contains('@foobar')
    // can't follow or be followed by your own account
    .expect($('.account-profile .account-profile-followed-by').innerText).eql('')
    .expect($('.account-profile .account-profile-follow').innerText).eql('')
})

test('shows account profile statuses', async t => {
  await t.useRole(foobarRole)
    .click($('.status-author-name').withText(('quux')))
    .expect(getUrl()).contains('/accounts/3')
    .expect($('.pinned-statuses .status-article').getAttribute('aria-setsize')).eql('2')
    .expect($('.pinned-statuses .status-article').getAttribute('aria-posinset')).eql('0')
    .expect($('.timeline .status-article').getAttribute('aria-posinset')).eql('0')
  await validateTimeline(t, quuxStatuses)
  await t.expect($('.timeline .status-article').getAttribute('aria-setsize')).eql('27')
})
