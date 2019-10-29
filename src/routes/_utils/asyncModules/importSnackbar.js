export const importSnackbar = () => import(
  /* webpackChunkName: 'Snackbar.html' */ '../../_components/snackbar/Snackbar.html'
).then(mod => mod.default)
