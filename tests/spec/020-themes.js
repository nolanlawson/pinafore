import {
  getBodyClassList,
  settingsNavButton
} from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'

fixture`020-themes.js`
  .page`http://localhost:4002`

test('can set a theme', async t => {
  await loginAsFoobar(t)
  await t
    .click(settingsNavButton)
    .click($('a[href="/settings/instances"]'))
    .click($('a[href="/settings/instances/localhost:3000"]'))
    .expect(getBodyClassList()).eql([])
    .click($('input[value="scarlet"]'))
    .expect(getBodyClassList()).eql(['theme-scarlet'])
    .click($('input[value="default"]'))
    .expect(getBodyClassList()).eql([])
})
