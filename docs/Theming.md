## Theming

This document describes how to write your own theme for Semaphore.

First, create a file `scss/themes/foobar.scss`, write some SCSS inside and add
the following at the bottom of `scss/themes/foobar.scss`.
```scss
@import "_base.scss";

body.theme-foobar {
  @include baseTheme();
}
```

> Note: You can find all the SCSS variables available in `scss/themes/_default.scss` 
> while the all CSS Custom Properties available are listed in `scss/themes/_base.scss`.

Then, Add your theme to `src/routes/_static/themes.js`
```js
const themes = [
  ...
  {
    name: 'foobar',
    label: 'Foobar', // user-visible name
    color: 'magenta', // main theme color
    dark: true // whether it's a dark theme or not
  }
]
```

Start the development server (`yarn run dev`), go to 
`http://localhost:4002/settings/instances/your-instance-name` and select your 
newly-created theme. Once you've done that, you can update your theme, and refresh 
the page to see the change (you don't have to restart the server).
