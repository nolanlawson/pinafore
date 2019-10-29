export const importComposeBox = () => import(
  /* webpackChunkName: 'ComposeBox.html' */ '../../_components/compose/ComposeBox.html'
).then(mod => mod.default)
