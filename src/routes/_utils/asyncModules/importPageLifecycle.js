export const importPageLifecycle = () => import(
  /* webpackChunkName: 'page-lifecycle' */ 'page-lifecycle/dist/lifecycle.mjs'
).then(mod => mod.default)
