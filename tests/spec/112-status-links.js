import {
  composeButton,
  composeInput,
  getNthStatus, getNthStatusSelector
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'

fixture`112-status-links.js`
  .page`http://localhost:4002`

test('External links, hashtags, and mentions have correct attributes', async t => {
  const text = 'Why hello there @admin and @baz and @quux ' +
    'and also #tag and #anotherTag and #yetAnotherTag ' +
    'and also http://example.com and https://joinmastodon.org and ' +
    'https://mastodon.social.'

  const nthAnchor = n => $(`${getNthStatusSelector(1)} .status-content a`).nth(n)

  await loginAsFoobar(t)
  await t
    .typeText(composeInput, text, { paste: true })
    .click(composeButton)
    .expect(getNthStatus(1).innerText).contains('Why hello there', { timeout: 20000 })
    .expect(nthAnchor(0).getAttribute('href')).eql('/accounts/1')
    .expect(nthAnchor(0).hasAttribute('rel')).notOk()
    .expect(nthAnchor(0).getAttribute('title')).eql('@admin')
    .expect(nthAnchor(0).hasAttribute('target')).notOk()
    .expect(nthAnchor(1).getAttribute('href')).eql('/accounts/5')
    .expect(nthAnchor(1).hasAttribute('rel')).notOk()
    .expect(nthAnchor(1).getAttribute('title')).eql('@baz')
    .expect(nthAnchor(1).hasAttribute('target')).notOk()
    .expect(nthAnchor(2).getAttribute('href')).eql('/accounts/3')
    .expect(nthAnchor(2).hasAttribute('rel')).notOk()
    .expect(nthAnchor(2).getAttribute('title')).eql('@quux')
    .expect(nthAnchor(2).hasAttribute('target')).notOk()
    .expect(nthAnchor(3).getAttribute('href')).eql('/tags/tag')
    .expect(nthAnchor(3).hasAttribute('rel')).notOk()
    .expect(nthAnchor(3).hasAttribute('target')).notOk()
    .expect(nthAnchor(4).getAttribute('href')).eql('/tags/anothertag')
    .expect(nthAnchor(4).hasAttribute('rel')).notOk()
    .expect(nthAnchor(4).hasAttribute('target')).notOk()
    .expect(nthAnchor(5).getAttribute('href')).eql('/tags/yetanothertag')
    .expect(nthAnchor(5).hasAttribute('rel')).notOk()
    .expect(nthAnchor(5).hasAttribute('target')).notOk()
    .expect(nthAnchor(6).getAttribute('href')).eql('http://example.com')
    .expect(nthAnchor(6).getAttribute('rel')).contains('nofollow noopener')
    .expect(nthAnchor(6).getAttribute('title')).eql('http://example.com')
    .expect(nthAnchor(6).getAttribute('target')).eql('_blank')
    .expect(nthAnchor(7).getAttribute('href')).eql('https://joinmastodon.org')
    .expect(nthAnchor(7).getAttribute('rel')).contains('nofollow noopener')
    .expect(nthAnchor(7).getAttribute('title')).eql('https://joinmastodon.org')
    .expect(nthAnchor(7).getAttribute('target')).eql('_blank')
    .expect(nthAnchor(8).getAttribute('href')).eql('https://mastodon.social')
    .expect(nthAnchor(8).getAttribute('rel')).contains('nofollow noopener')
    .expect(nthAnchor(8).getAttribute('title')).eql('https://mastodon.social')
    .expect(nthAnchor(8).getAttribute('target')).eql('_blank')
})
