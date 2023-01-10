# Internationalization

To contribute or change translations for Semaphore, look in the [src/intl](https://github.com/semaphore-social/semaphore/tree/master/src/intl) directory. Create a new file or edit an existing file based on its [two-letter language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) and optionally, a region. For instance, `en-US.js` is American English, and `fr.js` is French.

The default is `en-US.js`, and any strings not defined in a language file will fall back to the strings from that file.

There is also an `intl/emoji-picker` directory, which contains translations for [emoji-picker-element](https://github.com/nolanlawson/emoji-picker-element)
(which already comes with English built-in).

Note that internationalization is currently experimental. Client-side locale switching is not supported – when you build
the instance of Semaphore, it is either one language or another. To build in a particular language, use (for example):

    LOCALE=fr yarn build

or

    LOCALE=fr yarn dev

To host a localized version of Semaphore using Vercel, you can see this example: [buildCommand in vercel.json for Spanish](https://github.com/nvdaes/vercelPinafore/blob/45c70fb2088fe5f2380a729dab83e6f3ab4e6291/vercel.json#L9).