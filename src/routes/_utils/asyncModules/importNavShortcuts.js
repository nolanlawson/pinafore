export const importNavShortcuts = () => import(
  /* webpackChunkName: 'NavShortcuts' */ '../../_components/NavShortcuts.html'
).then(mod => mod.default)
