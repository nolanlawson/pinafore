import { Selector as $ } from 'testcafe'
import { getUrl, login } from '../utils'
import { foobarRole } from '../roles'

fixture `04-pinned-statuses.js`
  .page `http://localhost:4002`

test("shows a user's pinned statuses", async t => {
  await t.useRole(foobarRole)
    .click($('nav a[aria-label=Community]'))
    .expect(getUrl()).contains('/community')
    .click($('a').withText(('Pinned')))
    .expect(getUrl()).contains('/pinned')
    .expect($('.status-article').getAttribute('aria-posinset')).eql('0')
    .expect($('.status-article').getAttribute('aria-setsize')).eql('1')
    .expect($('.status-article .status-content').innerText).contains('this is unlisted')
})

test("shows pinned statuses on a user's account page", async t => {
  await t.useRole(foobarRole)
    .navigateTo('/accounts/2')
    .expect($('.pinned-statuses .status-article').getAttribute('aria-posinset')).eql('0')
    .expect($('.pinned-statuses .status-article').getAttribute('aria-setsize')).eql('1')
    .expect($('.pinned-statuses .status-article').innerText).contains('this is unlisted')
})

test("shows pinned statuses on a user's account page 2", async t => {
  await t.useRole(foobarRole)
    .navigateTo('/accounts/3')
    .expect($('.pinned-statuses .status-article').getAttribute('aria-posinset')).eql('0')
    .expect($('.pinned-statuses .status-article').getAttribute('aria-setsize')).eql('2')
    .expect($('.pinned-statuses .status-article').innerText).contains('pinned toot 1')
    .expect($('.pinned-statuses .status-article[aria-posinset="1"]').getAttribute('aria-setsize')).eql('2')
    .expect($('.pinned-statuses .status-article[aria-posinset="1"]').innerText).contains('pinned toot 2')
})