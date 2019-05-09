// browser shims that run in node, so that page-lifecycle won't error
global.self = global
global.document = {
  visibilityState: 'visible',
  hasFocus: () => true,
  wasDiscarded: false
}
global.addEventListener = () => {}
global.removeEventListener = () => {}
