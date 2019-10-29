export const importVirtualList = () => import(
  /* webpackChunkName: 'VirtualList.html' */ '../../_components/virtualList/VirtualList.html'
).then(mod => mod.default)
