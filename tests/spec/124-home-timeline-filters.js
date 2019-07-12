import {
  settingsNavButton, instanceSettingHomeReblogs, homeNavButton, sleep, getNthStatusContent
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'
import { postAs, reblogStatusAs } from '../serverActions'

fixture`124-home-timeline-filters.js`
  .page`http://localhost:4002`

test('Filters favs from home timeline', async t => {
  await postAs('foobar', 'Nobody should boost this')
  await sleep(1000)
  const { id: statusId } = await postAs('quux', 'I hope someone cool boosts this')
  await reblogStatusAs('admin', statusId)
  await sleep(2000)
  await loginAsFoobar(t)
  await t
    .expect(getNthStatusContent(1).innerText).contains('I hope someone cool boosts this')
    .expect(getNthStatusContent(2).innerText).contains('Nobody should boost this')
    .click(settingsNavButton)
    .click($('a').withText('Instances'))
    .click($('a').withText('localhost:3000'))
    .click(instanceSettingHomeReblogs)
    .expect(instanceSettingHomeReblogs.checked).notOk()
    .click(homeNavButton)
  await t
    .expect(getNthStatusContent(1).innerText).contains('Nobody should boost this')
})
