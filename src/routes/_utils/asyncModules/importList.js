export const importList = () => import(
  '../../_components/list/List.html'
).then(mod => mod.default)
