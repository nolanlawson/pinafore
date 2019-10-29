export const importToast = () => import(
  /* webpackChunkName: 'Toast.html' */ '../../_components/toast/Toast.html'
).then(mod => mod.default)
