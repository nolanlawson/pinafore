import { favoriteStatusAs, postAs } from '../serverActions'
import { loginAsFoobar } from '../roles'
import {
  communityNavButton, getUrl,
  sleep, validateTimeline
} from '../utils'
import { Selector as $ } from 'testcafe'

fixture`133-favorites.js`
  .page`http://localhost:4002`

test('favorites can paginate', async t => {
  const LENGTH = 25
  for (let i = 0; i < LENGTH; i++) {
    const { id } = await postAs('admin', `fav me ${i}`)
    await favoriteStatusAs('foobar', id)
    await sleep(1000)
  }
  await loginAsFoobar(t)
  await t
    .click(communityNavButton)
    .click($('a[href="/favorites"]'))
    .expect(getUrl()).contains('/favorites')

  const expectedTimeline = Array(LENGTH).fill().map((_, i) => ({ content: `fav me ${LENGTH - i - 1}` }))
  await validateTimeline(t, expectedTimeline)
})
