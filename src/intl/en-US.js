export default {
  appName: 'Pinafore',
  homeDescription: `
    <p>
      Pinafore is a web client for
      <a rel="noopener" target="_blank" href="https://joinmastodon.org">Mastodon</a>,
      designed for speed and simplicity.
    </p>
    <p>
      Read the
      <a rel="noopener" target="_blank"
         href="https://nolanlawson.com/2018/04/09/introducing-pinafore-for-mastodon/">introductory blog post</a>,
      or get started by logging in to an instance:
    </p>`,
  logIn: 'Log in',
  navItemLabel: `
    {label} {selected, select,
      true {(current page)}
      other {}
    } {name, select,
      notifications {{count, plural,
        =0 {}
        one {(1 notification)}
        other {({count} notifications)}
      }}
      community {{count, plural,
        =0 {}
        one {(1 follow request)}
        other {({count} follow requests)}
      }}
      other {}
    }
  `,
  justNow: 'just now'
}
