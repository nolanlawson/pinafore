import { emit } from '../../_utils/eventBus'

export function navObservers (store) {
  function pageIsInNav (store, page) {
    let { navPages } = store.get()
    return !!navPages.find(_ => _.name === page)
  }

  store.observe('currentPage', (currentPage, previousPage) => {
    if (currentPage && previousPage &&
        pageIsInNav(store, currentPage) &&
        pageIsInNav(store, previousPage)) {
      emit('animateNavPart1', {
        fromPage: previousPage,
        toPage: currentPage
      })
    }
  }, {
    init: false
  })
}
