import {
  getNthReblogButton, getNthReblogged, getNthStatus, getNthStatusContent, getReblogsCount, getUrl, homeNavButton,
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
    .hover(getNthStatus(0))
    .expect(getNthStatusContent(0).innerText).contains('should be reblogged')
    .expect(getNthReblogged(0)).eql('false')
    .click(getNthReblogButton(0))
    .expect(getNthReblogged(0)).eql('true')

  // scroll down and back up to force an unrender
  await scrollToBottom()
  await sleep(1)
  await scrollToTop()
  await t
    .hover(getNthStatus(0))
    .expect(getNthReblogged(0)).eql('true')
    .click(notificationsNavButton)
    .click(homeNavButton)
    .expect(getNthReblogged(0)).eql('true')
    .click(notificationsNavButton)
    .expect(getUrl()).contains('/notifications')
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .expect(getNthReblogged(0)).eql('true')
    .click(getNthReblogButton(0))
    .expect(getNthReblogged(0)).eql('false')
})

test('unreblogs a status', async t => {
  await postAs('foobar', 'woot i wanna reblog this')
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .expect(getNthStatusContent(0).innerText).contains('woot i wanna')
    .expect(getNthReblogged(0)).eql('false')
    .click(getNthReblogButton(0))
    .expect(getNthReblogged(0)).eql('true')
    .click(getNthReblogButton(0))
    .expect(getNthReblogged(0)).eql('false')

  // scroll down and back up to force an unrender
  await scrollToBottom()
  await sleep(1)
  await scrollToTop()
  await t
    .hover(getNthStatus(0))
    .expect(getNthReblogged(0)).eql('false')
    .click(notificationsNavButton)
    .click(homeNavButton)
    .expect(getNthReblogged(0)).eql('false')
    .click(notificationsNavButton)
    .navigateTo('/')
    .expect(getNthReblogged(0)).eql('false')
    .click(getNthReblogButton(0))
    .expect(getNthReblogged(0)).eql('true')
})

test('Keeps the correct reblogs count', async t => {
  let { id } = await postAs('foobar', 'this will be reblogged')
  await reblogStatusAs('foobar', id)
  await reblogStatusAs('admin', id)
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .expect(getNthStatusContent(0).innerText).contains('this will be reblogged')
    .expect(getNthReblogged(0)).eql('true')
    .click(getNthStatus(0))
    .expect(getUrl()).contains('/status')
    .expect(getNthReblogged(0)).eql('true')
    .expect(getReblogsCount()).eql(2)
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .hover(getNthStatus(0))
    .click(getNthReblogButton(0))
    .expect(getNthReblogged(0)).eql('false')
    .click(getNthStatus(0))
    .expect(getUrl()).contains('/status')
    .expect(getNthReblogged(0)).eql('false')
    .expect(getReblogsCount()).eql(1)
})
