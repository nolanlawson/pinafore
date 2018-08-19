import { getNthStatus, getNthStatusSelector, getUrl } from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'

fixture`016-external-links.js`
  .page`http://localhost:4002`

function getAnchor (nthStatus, nthAnchor) {
  return $(`${getNthStatusSelector(nthStatus)} .status-content a`).nth(nthAnchor)
}

function getAnchorInProfile (n) {
  return $('.account-profile-note a').nth(n)
}

test('converts external links in statuses', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .navigateTo('/accounts/4')
    .expect(getUrl()).contains('/accounts/4')
    .expect(getAnchor(0, 0).getAttribute('href')).eql('/accounts/1')
    .expect(getAnchor(0, 1).getAttribute('href')).eql('/accounts/3')
    .expect(getAnchor(1, 0).getAttribute('href')).eql('https://joinmastodon.org')
    .expect(getAnchor(1, 0).getAttribute('title')).eql('https://joinmastodon.org')
    .expect(getAnchor(1, 0).getAttribute('rel')).eql('nofollow noopener')
    .expect(getAnchor(1, 1).getAttribute('href')).eql('https://github.com/tootsuite/mastodon')
    .expect(getAnchor(1, 1).getAttribute('title')).eql('https://github.com/tootsuite/mastodon')
    .expect(getAnchor(1, 1).getAttribute('rel')).eql('nofollow noopener')
    .expect(getAnchor(2, 0).getAttribute('href')).eql('/tags/kitten')
    .expect(getAnchor(2, 1).getAttribute('href')).eql('/tags/kitties')
})

test('converts external links in profiles', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .navigateTo('/accounts/4')
    .expect(getUrl()).contains('/accounts/4')
    .expect($('.account-profile-name').innerText).contains('External Lonk')
    .expect($('.account-profile-name a').getAttribute('href')).eql('http://localhost:3000/@ExternalLinks')
    .expect($('.account-profile-name a').getAttribute('rel')).eql('nofollow noopener')
    .expect(getAnchorInProfile(0).getAttribute('href')).eql('https://joinmastodon.org')
    .expect(getAnchorInProfile(0).getAttribute('rel')).eql('nofollow noopener')
    .expect(getAnchorInProfile(1).getAttribute('href')).eql('http://localhost:3000/tags/cat')
    .expect(getAnchorInProfile(2).getAttribute('href')).eql('http://localhost:3000/tags/mastocats')
    .expect(getAnchorInProfile(3).getAttribute('href')).eql('http://localhost:3000/@quux')
})
