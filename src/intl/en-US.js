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
  justNow: 'just now',
  appDescription: 'An alternative web client for Mastodon, focused on speed and simplicity.',
  blockedUsers: 'Blocked users',
  bookmarks: 'Bookmarks',
  directMessages: 'Direct messages',
  favorites: 'Favorites',
  federated: 'Federated',
  home: 'Home',
  local: 'Local',
  mutedUsers: 'Muted users',
  pinnedStatuses: 'Pinned toots',
  followRequests: 'Follow requests',
  search: 'Search',
  pageHeader: 'Page header',
  goBack: 'Go back',
  back: 'Back',
  footer: `
    <p>
      Pinafore is
      <a rel="noopener" target="_blank" href="https://github.com/nolanlawson/pinafore">open-source software</a>
      created by
      <a rel="noopener" target="_blank" href="https://nolanlawson.com">Nolan Lawson</a>
      and distributed under the
      <a rel="noopener" target="_blank"
         href="https://github.com/nolanlawson/pinafore/blob/master/LICENSE">AGPL License</a>.
      Here is the <a href="/settings/about#privacy-policy" rel="prefetch">privacy policy</a>.
    </p>
  `,
  overLimit: '{count} {count, plural, =1 {character} other {characters}} over limit',
  underLimit: '{count} {count, plural, =1 {character} other {characters}} remaining',
  loading: 'Loading',
  filters: 'Filters',
  all: 'All',
  mentions: 'Mentions',
  global: 'Global',
  timeline: 'Timeline',
  media: 'Media',
  globalHotkeys: `
    {leftRightChangesFocus, select,
      true {
        <li><kbd>→</kbd> to go to the next focusable element</li>
        <li><kbd>←</kbd> to go to the previous focusable element</li>
      }
      other {}
    }
    <li>
      <kbd>1</kbd> - <kbd>6</kbd>
      {leftRightChangesFocus, select,
        true {}
        other {or <kbd>←</kbd>/<kbd>→</kbd>}
      }
      to switch columns
    </li>
    <li><kbd>7</kbd> or <kbd>c</kbd> to compose a new toot</li>
    <li><kbd>s</kbd> or <kbd>/</kbd> to search</li>
    <li><kbd>g</kbd> + <kbd>h</kbd> to go home</li>
    <li><kbd>g</kbd> + <kbd>n</kbd> to go to notifications</li>
    <li><kbd>g</kbd> + <kbd>l</kbd> to go to the local timeline</li>
    <li><kbd>g</kbd> + <kbd>t</kbd> to go to the federated timeline</li>
    <li><kbd>g</kbd> + <kbd>c</kbd> to go to the community page</li>
    <li><kbd>g</kbd> + <kbd>d</kbd> to go to the conversations page</li>
    <li><kbd>h</kbd> or <kbd>?</kbd> to toggle the help dialog</li>
    <li><kbd>Backspace</kbd> to go back, close dialogs</li>
  `,
  timelineHotkeys: `
    <li><kbd>j</kbd> or <kbd>↓</kbd> to activate the next toot</li>
    <li><kbd>k</kbd> or <kbd>↑</kbd> to activate the previous toot</li>
    <li><kbd>.</kbd> to show more and scroll to top</li>
    <li><kbd>o</kbd> to open</li>
    <li><kbd>f</kbd> to favorite</li>
    <li><kbd>b</kbd> to boost</li>
    <li><kbd>r</kbd> to reply</li>
    <li><kbd>i</kbd> to open images, video, or audio</li>
    <li><kbd>y</kbd> to show or hide sensitive media</li>
    <li><kbd>m</kbd> to mention the author</li>
    <li><kbd>p</kbd> to open the author's profile</li>
    <li><kbd>l</kbd> to open the card's link in a new tab</li>
    <li><kbd>x</kbd> to show or hide text behind content warning</li>
  `,
  mediaHotkeys: `
    <li><kbd>←</kbd> / <kbd>→</kbd> to go to next or previous</li>
  `,
  tabLabel: `{label} {current, select,
    true {(Current)}
    other {}
  }`,
  pageTitle: `
    {hasNotifications, select,
      true {({count})}
      other {}
    }
    {showInstanceName, select,
      true {{instanceName}}
      other {Pinafore}
    }
    ·
    {name}
  `,
  pinLabel: `{label} {pinnable, select,
    true {
      {pinned, select,
        true {(Pinned page)}
        other {(Unpinned page)}
      }
    }
    other {}
  }`,
  pinPage: 'Pin {label}',
  composeStatus: 'Compose toot',
  postStatus: 'Toot!',
  contentWarning: 'Content warning',
  dropToUpload: 'Drop to upload',
  invalidFileType: 'Invalid file type',
  composeLabel: "What's on your mind?",
  autocompleteDescription: 'When autocomplete results are available, press up or down arrows and enter to select.',
  mediaUploads: 'Media uploads',
  edit: 'Edit',
  delete: 'Delete',
  description: 'Description',
  descriptionLabel: 'Describe for the visually impaired (image, video) or auditorily impaired (audio, video)',
  markAsSensitive: 'Mark media as sensitive',
  createPoll: 'Create poll',
  removePollChoice: 'Remove choice {index}',
  pollChoiceLabel: 'Choice {index}',
  multipleChoice: 'Multiple choice',
  pollDuration: 'Poll duration',
  fiveMinutes: '5 minutes',
  thirtyMinutes: '30 minutes',
  oneHour: '1 hour',
  sixHours: '6 hours',
  oneDay: '1 day',
  threeDays: '3 days',
  sevenDays: '7 days',
  addEmoji: 'Insert emoji',
  addMedia: 'Add media (images, video, audio)',
  addPoll: 'Add poll',
  removePoll: 'Remove poll',
  postPrivacyLabel: 'Adjust privacy (currently {label})',
  addContentWarning: 'Add content warning',
  removeContentWarning: 'Remove content warning',
  followAccount: 'Follow {account}',
  unfollowAccount: 'Unfollow {account}',
  blockAccount: 'Block {account}',
  unblockAccount: 'Unblock {account}',
  muteAccount: 'Mute {account}',
  unmuteAccount: 'Unmute {account}',
  showReblogsFromAccount: 'Show boosts from {account}',
  hideReblogsFromAccount: 'Hide boosts from {account}',
  showDomain: 'Unhide {domain}',
  hideDomain: 'Hide {domain}',
  reportAccount: 'Report {account}',
  mentionAccount: 'Mention {account}',
  copyLinkToAccount: 'Copy link to account',
  okay: 'OK',
  cancel: 'Cancel',
  copiedToClipboard: 'Copied to clipboard',
  altLabel: 'Describe for the visually impaired',
  extractText: 'Extract text from image',
  extractingText: 'Extracting text…',
  extractingTextCompletion: 'Extracting text ({percent}% complete)…',
  unableToExtractText: 'Unable to extract text.',
  navigateMedia: 'Navigate media items',
  showPreviousMedia: 'Show previous media',
  showNextMedia: 'Show next media',
  enterPinchZoom: 'Pinch-zoom mode',
  exitPinchZoom: 'Exit pinch-zoom mode',
  showMedia: `Show {index, select,
    1 {first}
    2 {second}
    3 {third}
    other {fourth}
  } media {current, select,
    true {(current)}
    other {}
  }`,
  previewFocalPoint: 'Preview (focal point)',
  enterFocalPoint: 'Enter the focal point (X, Y) for this media',
  muteNotifications: 'Mute notifications as well',
  muteAccountConfirm: 'Mute {account}?',
  mute: 'Mute',
  zoomOut: 'Zoom out',
  zoomIn: 'Zoom in',
  reportingLabel: 'You are reporting {account} to the moderators of {instance}.',
  additionalComments: 'Additional comments',
  forwardDescription: 'Forward to the moderators of {instance} as well?',
  forwardLabel: 'Forward to {instance}',
  unableToLoadStatuses: 'Unable to load recent toots: {error}',
  report: 'Report',
  noContent: '(No content)',
  noStatuses: 'No toots to report',
  hotkeys: 'Hotkeys',
  unpinFromProfile: 'Unpin from profile',
  pinToProfile: 'Pin to profile',
  muteConversation: 'Mute conversation',
  unmuteConversation: 'Unmute conversation',
  bookmarkStatus: 'Bookmark toot',
  unbookmarkStatus: 'Unbookmark toot',
  deleteAndRedraft: 'Delete and redraft',
  reportStatus: 'Report toot',
  shareStatus: 'Share toot',
  copyLinkToStatus: 'Copy link to toot',
  profileForAccount: 'Profile for {account}',
  statisticsAndMoreOptions: 'Stats and more options',
  statuses: 'Toots',
  follows: 'Follows',
  followers: 'Followers',
  moreOptions: 'More options',
  followersLabel: 'Followed by {count}',
  followingLabel: 'Follows {count}',
  followLabel: `Follow {requested, select,
    true {(follow requested)}
    other {}
  }`,
  unfollowLabel: `Unfollow {requested, select,
    true {(follow requested)}
    other {}
  }`,
  unblock: 'Unblock',
  nameAndFollowing: 'Name and following',
  clickToSeeAvatar: 'Click to see avatar',
  opensInNewWindow: '{label} (opens in new window)',
  blocked: 'Blocked',
  domainHidden: 'Domain hidden',
  muted: 'Muted',
  followsYou: 'Follows you',
  avatarForAccount: 'Avatar for {account}',
  fields: 'Fields',
  accountHasMoved: '{account} has moved:',
  profilePageForAccount: 'Profile page for {account}',
  profile: 'Profile',
  profileNotLoggedIn: 'A user timeline will appear here when logged in.',
  settings: 'Settings',
  aboutApp: 'About Pinafore',
  general: 'General',
  instances: 'Instances',
  addInstance: 'Add instance',
  homeTimelineFilterSettings: 'Home timeline filter settings',
  switchOrLogOut: 'Switch to or log out of this instance',
  switchTo: 'Switch to this instance',
  logOut: 'Log out',
  logOutOfInstanceConfirm: 'Log out of {instance}?',
  notificationFilterSettings: 'Notification filter settings',
  browserDoesNotSupportPush: "Your browser doesn't support push notifications.",
  deniedPush: 'You have denied permission to show notifications.',
  pushNotificationsNote: 'Note that you can only have push notifications for one instance at a time.',
  pushSettings: 'Push notification settings',
  newFollowers: 'New followers',
  reblogs: 'Boosts',
  pollResults: 'Poll results',
  needToReauthenticate: 'You need to reauthenticate in order to enable push notification. Log out of {instance}?',
  failedToUpdatePush: 'Failed to update push notification settings: {error}',
  chooseTheme: 'Choose a theme',
  darkBackground: 'Dark background',
  lightBackground: 'Light background',
  themeLabel: `{label} {default, select,
    true {(default)}
    other {}
  }`,
  alert: 'Alert',
  close: 'Close'
}
