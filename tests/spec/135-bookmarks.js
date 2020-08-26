import {
  communityNavButton, getNthStatus,
  getNthStatusOptionsButton, homeNavButton
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'
import { postAs } from '../serverActions'

fixture`135-bookmarks.js`
  .page`http://localhost:4002`

test('Can open a report UI from a status', async t => {
  await postAs('admin', 'hey bookmark this')
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .click(getNthStatusOptionsButton(1))
    .click($('.modal-dialog button').withText('Bookmark'))
    .click(communityNavButton)
    .click($('a').withText('Bookmarks'))
    .expect(getNthStatus(1).innerText).contains('hey bookmark this')
    .click(homeNavButton)
    .click(getNthStatusOptionsButton(1))
    .click($('.modal-dialog button').withText('Unbookmark'))
})
