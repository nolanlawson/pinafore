export const importToast = () => import(
  '../../_components/toast/Toast.html'
).then(mod => mod.default)
