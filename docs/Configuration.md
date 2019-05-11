Configuration
====

This guide is for those who self-host Pinafore and who would like to change the default settings.

First, copy `config.sample.js` to `config.js`. Then change the options however you desire.

Here are the options:

<!-- These should be kept up to date with config.sample.json and config.defaults.json -->

| Option | Default | Notes |
| ------ | ------- | ----- |
| `port` | 4002    | The port that Pinafore should run on. Overridden by the environment variable `PORT`, if it exists. |
| `defaultLightTheme` | `"default"` | The default theme. The name `"default"` refers to the Royal (light blue) theme. Can be any theme in [`themes.js`](https://github.com/nolanlawson/pinafore/blob/master/src/routes/_static/themes.js). |
| `defaultDarkTheme` | `"ozark"` | If the user has set their browser or OS to a dark theme, then this theme is the default. (Only works in browsers that support [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme).) |
| `appName` | `"Pinafore"` | When the user registers Pinafore with their Mastodon instance, this is the app name provided. |
| `appUrl` | `"https://pinafore.social"` | When the user registers Pinafore with their Mastodon instance, this is the URL provided. |

No option is required. If omitted, then the default is assumed.
