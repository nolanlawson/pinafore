export const importList = () => import(
  /* webpackChunkName: 'List.html' */ '../../_components/list/List.html'
).then(mod => mod.default)
