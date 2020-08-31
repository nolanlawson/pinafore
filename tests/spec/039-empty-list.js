import {
  communityNavButton,
  getUrl, timeline
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'

fixture`039-empty-list.js`
  .page`http://localhost:4002`

test('Can show an empty list of bookmarks', async t => {
  await loginAsFoobar(t)
  await t
    .click(communityNavButton)
    .click($('a').withText('Bookmarks'))
    .expect(getUrl()).contains('bookmarks')
    .expect(timeline.innerText).contains('Nothing to show.')
})

test('Can show an empty list of media', async t => {
  await loginAsFoobar(t)
  await t
    .click($('a').withText('quux'))
    .expect(getUrl()).contains('accounts/3')
    .click($('a').withText('Media'))
    .expect(getUrl()).contains('accounts/3/media')
    .expect(timeline.innerText).contains('Nothing to show.')
})
