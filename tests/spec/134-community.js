import { createListAs, getListsAs } from '../serverActions'
import { loginAsFoobar } from '../roles'
import {
  communityNavButton, getCommunityPinRadioButtonIds, getUrl
} from '../utils'
import { Selector as $ } from 'testcafe'

fixture`134-community.js`
  .page`http://localhost:4002`

test('pinnable community items have proper IDs for accessible radio buttons', async t => {
  const lists = (await getListsAs('foobar')).map(_ => _.title)
  if (!lists.includes('Test list 1')) {
    await createListAs('foobar', 'Test list 1')
  }
  if (!lists.includes('Test list 2')) {
    await createListAs('foobar', 'Test list 2')
  }
  await loginAsFoobar(t)
  await t
    .click(communityNavButton)
    .expect(getUrl()).contains('community')
    .expect($('[aria-label=Lists] li:nth-child(1)').innerText).contains('Test list 1')
    .expect($('[aria-label=Lists] li:nth-child(2)').innerText).contains('Test list 2')

  const ids = await getCommunityPinRadioButtonIds()
  await t
    .expect(ids.length).gt(0)

  const uniqueIds = [...new Set(ids)]
  await t
    .expect(ids.length).eql(
      uniqueIds.length,
      `Expect ${JSON.stringify(ids)} to have same length as ${JSON.stringify(uniqueIds)}`
    )
    .expect($('[role=radiogroup]').getAttribute('aria-owns')).eql(ids.join(' '))
})
