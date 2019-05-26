import {
  settingsNavButton,
  getNthStatusContent,
  instanceSettingNotificationReblogs,
  notificationBadge,
  instanceSettingNotificationFavs,
  instanceSettingNotificationMentions, instanceSettingNotificationFollows
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'
import { favoriteStatusAs, followAs, postAs, reblogStatusAs, unfollowAs } from '../serverActions'

fixture`125-notification-timeline-filters.js`
  .page`http://localhost:4002`

test('Notification timeline filters correctly affect counts - boosts', async t => {
  let timeout = 20000
  let { id: statusId } = await postAs('foobar', 'I do not care if you boost this')
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).contains('I do not care if you boost this')
  await reblogStatusAs('admin', statusId)
  await t
    .expect(notificationBadge.innerText).eql('1', { timeout })
    .click(settingsNavButton)
    .click($('a').withText('Instances'))
    .click($('a').withText('localhost:3000'))
    .click(instanceSettingNotificationReblogs)
    .expect(instanceSettingNotificationReblogs.checked).notOk()
    .expect(notificationBadge.exists).notOk({ timeout })
    .click(instanceSettingNotificationReblogs)
    .expect(instanceSettingNotificationReblogs.checked).ok()
    .expect(notificationBadge.innerText).eql('1', { timeout })
})

test('Notification timeline filters correctly affect counts - favs', async t => {
  let timeout = 20000
  let { id: statusId } = await postAs('foobar', 'I do not care if you fav this')
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).contains('I do not care if you fav this')
  await favoriteStatusAs('admin', statusId)
  await t
    .expect(notificationBadge.innerText).eql('1', { timeout })
    .click(settingsNavButton)
    .click($('a').withText('Instances'))
    .click($('a').withText('localhost:3000'))
    .click(instanceSettingNotificationFavs)
    .expect(instanceSettingNotificationFavs.checked).notOk()
    .expect(notificationBadge.exists).notOk({ timeout })
    .click(instanceSettingNotificationFavs)
    .expect(instanceSettingNotificationFavs.checked).ok()
    .expect(notificationBadge.innerText).eql('1', { timeout })
})

test('Notification timeline filters correctly affect counts - favs', async t => {
  let timeout = 20000
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).exists).ok()
  await postAs('admin', 'hey yo @foobar')
  await t
    .expect(notificationBadge.innerText).eql('1', { timeout })
    .click(settingsNavButton)
    .click($('a').withText('Instances'))
    .click($('a').withText('localhost:3000'))
    .click(instanceSettingNotificationMentions)
    .expect(instanceSettingNotificationMentions.checked).notOk()
    .expect(notificationBadge.exists).notOk({ timeout })
    .click(instanceSettingNotificationMentions)
    .expect(instanceSettingNotificationMentions.checked).ok()
    .expect(notificationBadge.innerText).eql('1', { timeout })
})

test('Notification timeline filters correctly affect counts - follows', async t => {
  let timeout = 20000
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).exists).ok()
  await followAs('ExternalLinks', 'foobar')
  await t
    .expect(notificationBadge.innerText).eql('1', { timeout })
    .click(settingsNavButton)
    .click($('a').withText('Instances'))
    .click($('a').withText('localhost:3000'))
    .click(instanceSettingNotificationFollows)
    .expect(instanceSettingNotificationFollows.checked).notOk()
    .expect(notificationBadge.exists).notOk({ timeout })
    .click(instanceSettingNotificationFollows)
    .expect(instanceSettingNotificationMentions.checked).ok()
    .expect(notificationBadge.innerText).eql('1', { timeout })
  await unfollowAs('ExternalLinks', 'foobar')
})
