import {
  getNthReblogButton, getNthRebloggedLabel, getNthStatus, getNthStatusContent, getReblogsCount, getUrl, homeNavButton,
  notificationsNavButton, scrollToBottom, scrollToTop, sleep
} from '../utils'
import { loginAsFoobar } from '../roles'
import { postAs, reblogStatusAs } from '../serverActions'

fixture`101-reblog-unreblog.js`
  .page`http://localhost:4002`

test('reblogs a status', async t => {
  await postAs('foobar', 'hello this should be reblogged')
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .expect(getNthStatusContent(1).innerText).contains('should be reblogged')
    .expect(getNthRebloggedLabel(1)).eql('Boost')
    .click(getNthReblogButton(1))
    .expect(getNthRebloggedLabel(1)).eql('Unboost')

  // scroll down and back up to force an unrender
  await scrollToBottom()
  await sleep(1)
  await scrollToTop()
  await t
    .hover(getNthStatus(1))
    .expect(getNthRebloggedLabel(1)).eql('Unboost')
    .click(notificationsNavButton)
    .click(homeNavButton)
    .expect(getNthRebloggedLabel(1)).eql('Unboost')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthRebloggedLabel(1)).eql('Unboost')
    .click(getNthReblogButton(1))
    .expect(getNthRebloggedLabel(1)).eql('Boost')
})

test('unreblogs a status', async t => {
  await postAs('foobar', 'woot i wanna reblog this')
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .expect(getNthStatusContent(1).innerText).contains('woot i wanna')
    .expect(getNthRebloggedLabel(1)).eql('Boost')
    .click(getNthReblogButton(1))
    .expect(getNthRebloggedLabel(1)).eql('Unboost')
    .click(getNthReblogButton(1))
    .expect(getNthRebloggedLabel(1)).eql('Boost')

  // scroll down and back up to force an unrender
  await scrollToBottom()
  await sleep(1)
  await scrollToTop()
  await t
    .hover(getNthStatus(1))
    .expect(getNthRebloggedLabel(1)).eql('Boost')
    .click(notificationsNavButton)
    .click(homeNavButton)
    .expect(getNthRebloggedLabel(1)).eql('Boost')
    .click(notificationsNavButton)
    .navigateTo('/')
    .expect(getNthRebloggedLabel(1)).eql('Boost')
    .click(getNthReblogButton(1))
    .expect(getNthRebloggedLabel(1)).eql('Unboost')
})

test('Keeps the correct reblogs count', async t => {
  const { id } = await postAs('foobar', 'this will be reblogged')
  await reblogStatusAs('foobar', id)
  await reblogStatusAs('admin', id)
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(1))
    .expect(getNthStatusContent(1).innerText).contains('this will be reblogged')
    .expect(getNthRebloggedLabel(1)).eql('Unboost')
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/status')
    .expect(getNthRebloggedLabel(1)).eql('Unboost')
    .expect(getReblogsCount()).eql(2)
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .hover(getNthStatus(1))
    .click(getNthReblogButton(1))
    .expect(getNthRebloggedLabel(1)).eql('Boost')
    .click(getNthStatus(1))
    .expect(getUrl()).contains('/status')
    .expect(getNthRebloggedLabel(1)).eql('Boost')
    .expect(getReblogsCount()).eql(1)
})
