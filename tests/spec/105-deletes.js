import { foobarRole } from '../roles'
import { getNthStatus } from '../utils'
import { deleteAsAdmin, postAsAdmin } from '../serverActions'

fixture`105-deletes.js`
  .page`http://localhost:4002`

test('deleted statuses are removed from the timeline', async t => {
  await t.useRole(foobarRole)
    .hover(getNthStatus(0))
  let status = await postAsAdmin("I'm gonna delete this")
  await t.expect(getNthStatus(0).innerText).contains("I'm gonna delete this")
  await deleteAsAdmin(status.id)
  await t.expect(getNthStatus(0).innerText).notContains("I'm gonna delete this")
})
