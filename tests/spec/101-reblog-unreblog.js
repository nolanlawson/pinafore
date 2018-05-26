import {
  getNthReblogButton, getNthReblogged, getNthStatus, getReblogsCount, getUrl, homeNavButton,
  notificationsNavButton,
  scrollToBottomOfTimeline, scrollToTopOfTimeline
} from '../utils'
import { loginAsFoobar } from '../roles'

fixture`101-reblog-unreblog.js`
  .page`http://localhost:4002`

test('reblogs a status', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(0))
    .expect(getNthReblogged(0)).eql('false')
    .click(getNthReblogButton(0))
    .expect(getNthReblogged(0)).eql('true')

  // scroll down and back up to force an unrender
  await scrollToBottomOfTimeline(t)
  await scrollToTopOfTimeline(t)
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
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(4))
    .expect(getNthReblogged(4)).eql('false')
    .click(getNthReblogButton(4))
    .expect(getNthReblogged(4)).eql('true')
    .click(getNthReblogButton(4))
    .expect(getNthReblogged(4)).eql('false')

  // scroll down and back up to force an unrender
  await scrollToBottomOfTimeline(t)
  await scrollToTopOfTimeline(t)
  await t
    .hover(getNthStatus(4))
    .expect(getNthReblogged(4)).eql('false')
    .click(notificationsNavButton)
    .click(homeNavButton)
    .expect(getNthReblogged(4)).eql('false')
    .click(notificationsNavButton)
    .navigateTo('/')
    .expect(getNthReblogged(4)).eql('false')
    .click(getNthReblogButton(4))
    .expect(getNthReblogged(4)).eql('true')
})

test('Keeps the correct reblogs count', async t => {
  await loginAsFoobar(t)
  await t
    .hover(getNthStatus(4))
    .expect(getNthReblogged(4)).eql('true')
    .click(getNthStatus(4))
    .expect(getUrl()).contains('/status')
    .expect(getNthReblogged(0)).eql('true')
    .expect(getReblogsCount()).eql(2)
    .click(homeNavButton)
    .expect(getUrl()).eql('http://localhost:4002/')
    .hover(getNthStatus(4))
    .click(getNthReblogButton(4))
    .expect(getNthReblogged(4)).eql('false')
    .click(getNthStatus(4))
    .expect(getUrl()).contains('/status')
    .expect(getNthReblogged(0)).eql('false')
    .expect(getReblogsCount()).eql(1)
})
