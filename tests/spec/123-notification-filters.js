import {
  getNthStatusContent,
  getUrl, notificationFiltersAll, notificationFiltersMention,
  notificationsNavButton, sleep
} from '../utils'
import { loginAsFoobar } from '../roles'
import { favoriteStatusAs, postAs } from '../serverActions'

fixture`123-notification-filters.js`
  .page`http://localhost:4002`

// maybe in the "mentions" view it should prevent the notification icon from showing (1), (2) etc
// if those particular notifications were seen by the user... but this is too hard to implement,
// so I'm going to punt on it. Only the "all" view affects those (1) / (2) / etc badges.
test('Handles incoming notifications that are mentions', async t => {
  const timeout = 20000
  await loginAsFoobar(t)
  await t
    .click(notificationsNavButton)
    .expect(getUrl()).match(/\/notifications$/)
    .click(notificationFiltersMention)
    .expect(getUrl()).match(/\/notifications\/mentions$/)
  await sleep(2000)
  await postAs('admin', 'hey @foobar I am mentioning you')
  await t
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications (current page) (1 notification)', {
      timeout
    })
    .expect(getNthStatusContent(1).innerText).contains('hey @foobar I am mentioning you')
    .click(notificationFiltersAll)
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications (current page)', { timeout })
})

test('Handles incoming notifications that are not mentions', async t => {
  const timeout = 20000
  let { id: statusId } = await postAs('foobar', 'this is a post that I hope somebody will favorite')
  await sleep(2000)
  await loginAsFoobar(t)
  await t
    .click(notificationsNavButton)
    .expect(getUrl()).match(/\/notifications$/)
    .click(notificationFiltersMention)
    .expect(getUrl()).match(/\/notifications\/mentions$/)
  await sleep(2000)
  await postAs('admin', 'woot I am mentioning you again @foobar')
  await t
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications (current page) (1 notification)', {
      timeout
    })
    .expect(getNthStatusContent(1).innerText).contains('woot I am mentioning you again @foobar')
  await sleep(2000)
  await favoriteStatusAs('admin', statusId)
  await t
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications (current page) (2 notifications)', {
      timeout
    })
  await sleep(2000)
  await t
    .expect(getNthStatusContent(1).innerText).contains('woot I am mentioning you again @foobar')
    .click(notificationFiltersAll)
    .expect(notificationsNavButton.getAttribute('aria-label')).eql('Notifications (current page)', { timeout })
  await t
    .expect(getNthStatusContent(1).innerText).contains('this is a post that I hope somebody will favorite')
    .expect(getNthStatusContent(2).innerText).contains('woot I am mentioning you again @foobar')
})
