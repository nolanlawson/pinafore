import { settingsNavButton, getCurrentTheme, getNthStatus } from '../utils'
import { loginAsFoobar } from '../roles'
import { Selector as $ } from 'testcafe'
import { checkForViolations } from '@testcafe-community/axe';

fixture`020-themes.js`
  .page`http://localhost:4002`

function checkColorsAreReadable(t) {
  return checkForViolations(t, null, {
    runOnly: 'color-contrast',
    rules: {
      'color-contrast': { enabled: true }
    }
  })
}

test('can set a theme', async t => {
  await loginAsFoobar(t)
  await t
    .click(settingsNavButton)
    .click($('a[href="/settings/instances"]'))
    .click($('a[href="/settings/instances/localhost:3000"]'))
    .expect(getCurrentTheme()).eql('default')
    .click($('input[value="scarlet"]'))
    .expect(getCurrentTheme()).eql('scarlet')
    .click($('input[value="default"]'))
    .expect(getCurrentTheme()).eql('default')
})

test(`Default light theme should pass automated color contrast checks`, async t => {
  await loginAsFoobar(t)
  await t
    .navigateTo('/settings/general')
    .expect(getCurrentTheme()).eql('default')
  await t.navigateTo('/')
    .expect(getNthStatus(1).exists)
    .ok({ timeout: 30000 })
  await checkColorsAreReadable(t)
});

test(`Default dark theme should pass automated color contrast checks`, async t => {
  await loginAsFoobar(t)
  await t
    .navigateTo('/settings/general')
    .click($(`input[value="ozark"]`))
    .expect(getCurrentTheme()).eql('ozark')
  await t.navigateTo('/')
    .expect(getNthStatus(1).exists)
    .ok({ timeout: 30000 })
  await checkColorsAreReadable(t)
});

