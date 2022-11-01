export function bottomNavObservers (store) {
  store.observe('bottomNav', bottomNav => {
    // disables or enables the style
    document.body.classList.toggle('bottom-nav', bottomNav);
    document.querySelector('.main-content').classList.toggle('bottom-nav', bottomNav);
    document.getElementById('main-nav').classList.toggle('bottom-nav', bottomNav);
  }, { init: false })
}
