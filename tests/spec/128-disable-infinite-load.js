import {
  settingsNavButton,
  homeNavButton,
  disableInfiniteScroll,
  getFirstVisibleStatus,
  getUrl,
  showMoreButton, getNthStatusContent
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'
import { postAs } from '../serverActions'

fixture`128-disable-infinite-load.js`
  .page`http://localhost:4002`

test('Can disable loading items at top of timeline', async t => {
  await loginAsFoobar(t)
  await t.click(settingsNavButton)
    .click($('a').withText('General'))
    .click(disableInfiniteScroll)
    .expect(disableInfiniteScroll.checked).ok()
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getFirstVisibleStatus().exists).ok()
  await postAs('admin', 'hey hey hey this is new')
  await t
    .expect(showMoreButton.innerText).contains('Show 1 more', {
      timeout: 20000
    })
    .click(showMoreButton)
    .expect(getNthStatusContent(1).innerText).contains('hey hey hey this is new')
})
