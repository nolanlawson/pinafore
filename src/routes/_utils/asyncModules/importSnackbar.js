export const importSnackbar = () => import(
  '../../_components/snackbar/Snackbar.html'
).then(mod => mod.default)
