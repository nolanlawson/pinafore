export const importPageLifecycle = () => import(
  'page-lifecycle/dist/lifecycle.mjs'
).then(mod => mod.default)
