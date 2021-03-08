import { on } from '../../_utils/eventBus'
import { updateFiltersForInstance } from '../../_actions/filters'

export function filterObservers () {
  if (!process.browser) {
    return
  }
  on('wordFiltersChanged', instanceName => {
    /* no await */ updateFiltersForInstance(instanceName)
  })
}
