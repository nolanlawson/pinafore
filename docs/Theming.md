## Theming

Create a file `scss/themes/foobar.scss`, write some SCSS inside and add the following at the bottom of `scss/themes/foobar.scss`.
```scss
@import "_base.scss";

body.theme-foobar {
  @include baseTheme();
}
```

> Note: You can find all the SCSS variables available in `scss/themes/_default.scss` while the all CSS Custom Properties available are listed in `scss/themes/_base.scss`.

Add the CSS class you just define to `scss/themes/_offlines`.
```scss
...
body.offline,
body.theme-foobar.offline, // <-
body.theme-hotpants.offline,
body.theme-majesty.offline,
body.theme-oaken.offline,
body.theme-scarlet.offline,
body.theme-seafoam.offline,
body.theme-gecko.offline {
  @include baseTheme();
}

```

Add your theme to `routes/_static/themes.js`
```js
const themes = [
  ...
  {
    name: 'foobar',
    label: 'Foobar'
  }
]

export { themes }
```

Add your theme in `inline-script.js`.
```js
window.__themeColors = {
      'default': "royalblue",
      scarlet:   "#e04e41",
      seafoam:   "#177380",
      hotpants:  "hotpink",
      oaken:     "saddlebrown",
      majesty:   "blueviolet",
      gecko:     "#4ab92f",
      foobar:    "#BADA55", // <-
      offline:   "#999999"
    }
```

Start the development server (`npm run dev`), go to `http://localhost:4002/settings/instances/your-instance-name` and select your newly created theme. Once you've done that, you can update your theme, and refresh the page to see the change (you don't have to restart the server).
