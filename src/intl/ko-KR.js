export default {
  // Home page, basic <title> and <description>
  appName: "Pinafore",
  appDescription:
    "속도와 단순함에 집중하는, 마스토돈을 위한 대안 웹 클라이언트.",
  homeDescription: `
    <p>
      Pinafore(피나포레)는
      <a rel="noopener" target="_blank" href="https://joinmastodon.org">
        마스토돈</a>을 위한 웹 클라이언트로,
      속도와 단순함을 위해 설계되었습니다.
    </p>
    <p>
      <a rel="noopener" target="_blank"
        href="https://nolanlawson.com/2018/04/09/introducing-pinafore-for-mastodon/">
        안내 블로그 포스트</a>를 읽어 보거나, 인스턴스에 로그인하여 시작해
      보세요:
    </p>`,
  logIn: "로그인",
  footer: `
    <p>
      Pinafore는
      <a rel="noopener" target="_blank" href="https://nolanlawson.com">
        Nolan Lawson</a>이 만들고
      <a rel="noopener" target="_blank"
        href="https://github.com/nolanlawson/pinafore/blob/master/LICENSE">
        AGPL 라이선스</a>로 배포되는
      <a rel="noopener" target="_blank"
        href="https://github.com/nolanlawson/pinafore">
        오픈 소스 소프트웨어</a>입니다.
      <a href="/settings/about#privacy-policy" rel="prefetch">개인 정보 보호 정책</a>
    </p>
  `,
  // Manifest
  longAppName: "Pinafore",
  newStatus: "새 툿",
  // Generic UI
  loading: "불러오는 중",
  okay: "확인",
  cancel: "취소",
  alert: "경고",
  close: "닫기",
  error: "오류: {error}",
  errorShort: "오류:",
  // Relative timestamps
  justNow: "방금",
  // Navigation, page titles
  navItemLabel: `
    {label} {selected, select,
      true {(현재 페이지)}
      other {}
    } {name, select,
      notifications {{count, plural,
        =0 {}
        one {(알림 1개)}
        other {(알림 {count}개)}
      }}
      community {{count, plural,
        =0 {}
        one {(팔로우 요청 1개)}
        other {(팔로우 요청 {count}개)}
      }}
      other {}
    }
  `,
  blockedUsers: "차단된 사용자",
  bookmarks: "북마크",
  directMessages: "다이렉트 메시지",
  favorites: "관심글",
  federated: "연합",
  home: "홈",
  local: "로컬",
  notifications: "알림",
  mutedUsers: "뮤트된 사용자",
  pinnedStatuses: "고정된 툿",
  followRequests: "팔로우 요청",
  followRequestsLabel: `팔로우 요청 {hasFollowRequests, select,
    true {({count})}
    other {}
  }`,
  list: "리스트",
  search: "검색",
  pageHeader: "페이지 머릿글",
  goBack: "뒤로 가기",
  back: "뒤로",
  profile: "프로필",
  federatedTimeline: "연합 타임라인",
  localTimeline: "로컬 타임라인",
  // community page
  community: "커뮤니티",
  pinnableTimelines: "고정할 수 있는 타임라인",
  timelines: "타임라인",
  lists: "리스트",
  instanceSettings: "인스턴스 설정",
  notificationMentions: "언급 알림",
  profileWithMedia: "프로필과 미디어",
  profileWithReplies: "프로필과 답글",
  hashtag: "해시태그",
  // not logged in
  profileNotLoggedIn: "로그인하면 여기에 사용자 타임라인이 표시됩니다.",
  bookmarksNotLoggedIn: "로그인하면 여기에 북마크가 표시됩니다.",
  directMessagesNotLoggedIn:
    "로그인하면 여기에 다이렉트 메시지가 표시됩니다.",
  favoritesNotLoggedIn: "로그인하면 여기에 관심글이 표시됩니다.",
  federatedTimelineNotLoggedIn:
    "로그인하면 여기에 연합 타임라인이 표시됩니다.",
  localTimelineNotLoggedIn: "로그인하면 여기에 로컬 타임라인이 표시됩니다.",
  searchNotLoggedIn: "인스턴스에 로그인하면 여기에서 검색할 수 있습니다.",
  communityNotLoggedIn: "로그인하면 여기에 커뮤니티 설정이 표시되빈다.",
  listNotLoggedIn: "로그인하면 여기에 리스트가 표시됩니다.",
  notificationsNotLoggedIn:
    "로그인하면 여기에 알림이 표시됩니다.",
  notificationMentionsNotLoggedIn:
    "로그인하면 여기에 멘션 알림이 표시됩니다.",
  statusNotLoggedIn: "로그인하면 여기에 글타래가 표시됩니다.",
  tagNotLoggedIn: "로그인하면 여기에 해시태그 타임라인이 표시됩니다.",
  // Notification subpages
  filters: "필터",
  all: "모두",
  mentions: "멘션",
  // Follow requests
  approve: "승인",
  reject: "거부",
  // Hotkeys
  hotkeys: "키보드 바로가기",
  global: "전체",
  timeline: "타임라인",
  media: "미디어",
  globalHotkeys: `
    {leftRightChangesFocus, select,
      true {
        <li><kbd>→</kbd> 다음 선택 가능한 요소로 이동하기</li>
        <li><kbd>←</kbd> 이전 선택 가능한 요소로 이동허가</li>
      }
      other {}
    }
    <li>
      <kbd>1</kbd> - <kbd>6</kbd>
      {leftRightChangesFocus, select,
        true {}
        other {or <kbd>←</kbd>/<kbd>→</kbd>}
      }
      다른 보기로 이동하기
    </li>
    <li><kbd>7</kbd> 또는 <kbd>c</kbd> 새 툿 작성하기</li>
    <li><kbd>s</kbd> 또는 <kbd>/</kbd> 검색하기</li>
    <li><kbd>g</kbd> + <kbd>h</kbd> 홈으로 이동하기</li>
    <li><kbd>g</kbd> + <kbd>n</kbd> 알림으로 이동하기</li>
    <li><kbd>g</kbd> + <kbd>l</kbd> 로컬 타임라인으로 이동하기</li>
    <li><kbd>g</kbd> + <kbd>t</kbd> 연합 타임라인으로 이동하기</li>
    <li><kbd>g</kbd> + <kbd>c</kbd> 커뮤니티 페이지로 이동하기</li>
    <li><kbd>g</kbd> + <kbd>d</kbd> 다이렉트 메시지 페이지로 이동하기</li>
    <li><kbd>h</kbd> 또는 <kbd>?</kbd> 도움말 대화 상자 여닫기</li>
    <li><kbd>Backspace</kbd> 뒤로 가거나 대화 상자 닫기</li>
  `,
  timelineHotkeys: `
    <li><kbd>j</kbd> 또는 <kbd>↓</kbd> 다음 글 활성화하기</li>
    <li><kbd>k</kbd> 또는 <kbd>↑</kbd> 이전 글 활성화하기</li>
    <li><kbd>.</kbd> 더보기 및 맨 위로 가기</li>
    <li><kbd>o</kbd> 열기</li>
    <li><kbd>f</kbd> 관심글로 지정하기</li>
    <li><kbd>b</kbd> 부스트하기</li>
    <li><kbd>r</kbd> 댓글 남기기</li>
    <li><kbd>i</kbd> 이미지, 동영상이나 오디오 열기</li>
    <li><kbd>y</kbd> 민감한 미디어 보이거나 숨기기</li>
    <li><kbd>m</kbd> 글쓴이를 멘션하기</li>
    <li><kbd>p</kbd> 글쓴이의 프로필 열기</li>
    <li><kbd>l</kbd> 카드의 링크를 새 탭에서 열기</li>
    <li><kbd>x</kbd> 내용 경고 뒤의 글 보이거나 숨기기</li>
    <li><kbd>z</kbd> 타래의 모든 내용 경고 보이거나 숨기기</li>
  `,
  mediaHotkeys: `
    <li><kbd>←</kbd> / <kbd>→</kbd> 다음이나 이전으로 가기</li>
  `,
  // Community page, tabs
  tabLabel: `{label} {current, select,
    true {(Current)}
    other {}
  }`,
  pageTitle: `
    {hasNotifications, select,
      true {({count})}
      other {}
    }
    {name}
    ·
    {showInstanceName, select,
      true {{instanceName}}
      other {Pinafore}
    }
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
  pinPage: "{label} 고정하기",
  // Status composition
  overLimit:
    "{count} {count, plural, =1 {자} other {자}} 초과",
  underLimit:
    "{count} {count, plural, =1 {자} other {자}} 남음",
  composeStatus: "툿 작성하기",
  postStatus: "툿!",
  contentWarning: "내용 경고",
  dropToUpload: "파일을 올리려면 여기에 놓으세요",
  invalidFileType: "올릴 수 없는 파일 형식",
  composeLabel: "무슨 생각을 하고 있나요?",
  autocompleteDescription:
    "자동 완성 추천이 준비되면 위아래 화살표와 엔터를 사용하여 선택하세요.",
  mediaUploads: "첨부된 미디어",
  edit: "수정",
  delete: "삭제",
  description: "설명",
  descriptionLabel:
    "시각(이미지, 동영상)이나 청각(오디오, 동영상) 장애를 가진 사람들을 위해 설명을 추가하세요.",
  markAsSensitive: "민감한 미디어로 설정하기",
  // Polls
  createPoll: "투표 만들기",
  removePollChoice: "{index}번 선택지 삭제",
  pollChoiceLabel: "{index}번 선택지",
  multipleChoice: "복수 선택",
  pollDuration: "투표 기간",
  fiveMinutes: "5분",
  thirtyMinutes: "30분",
  oneHour: "1시간",
  sixHours: "6시간",
  twelveHours: "12시간",
  oneDay: "1일",
  threeDays: "3일",
  sevenDays: "7일",
  never: "기간 없음",
  addEmoji: "이모지 넣기",
  addMedia: "미디어(이미지, 동영상, 오디오) 넣기",
  addPoll: "투표 넣기",
  removePoll: "투표 삭제하기",
  postPrivacyLabel: "공개 범위 조절 (현재 {label})",
  addContentWarning: "내용 경고 넣기",
  removeContentWarning: "내용 경고 삭제하기",
  altLabel: "시각 장애인을 위한 설명 넣기",
  extractText: "사진에서 글자 추출하기",
  extractingText: "글자를 추출하는 중…",
  extractingTextCompletion: "글자를 추출하는 중 ({percent}% 완료)…",
  unableToExtractText: "글자를 추출할 수 없습니다.",
  // Account options
  followAccount: "{account} 팔로우",
  unfollowAccount: "{account} 팔로우 해제",
  blockAccount: "{account} 차단",
  unblockAccount: "{account} 차단 해제",
  muteAccount: "{account} 뮤트",
  unmuteAccount: "{account} 뮤트 해제",
  showReblogsFromAccount: "{account}의 부스트 보이기",
  hideReblogsFromAccount: "{account}의 부스트 숨기기",
  showDomain: "{domain} 숨김 해제",
  hideDomain: "{domain} 숨기기",
  reportAccount: "{account} 신고",
  mentionAccount: "{account} 멘션",
  copyLinkToAccount: "계정 링크 복사",
  copiedToClipboard: "클립보드에 복사됨",
  // Media dialog
  navigateMedia: "Navigate media items",
  showPreviousMedia: "Show previous media",
  showNextMedia: "Show next media",
  enterPinchZoom: "Pinch-zoom mode",
  exitPinchZoom: "Exit pinch-zoom mode",
  showMedia: `Show {index, select,
    1 {first}
    2 {second}
    3 {third}
    other {fourth}
  } media {current, select,
    true {(current)}
    other {}
  }`,
  previewFocalPoint: "Preview (focal point)",
  enterFocalPoint: "Enter the focal point (X, Y) for this media",
  muteNotifications: "Mute notifications as well",
  muteAccountConfirm: "Mute {account}?",
  mute: "Mute",
  unmute: "Unmute",
  zoomOut: "Zoom out",
  zoomIn: "Zoom in",
  // Reporting
  reportingLabel:
    "You are reporting {account} to the moderators of {instance}.",
  additionalComments: "Additional comments",
  forwardDescription: "Forward to the moderators of {instance} as well?",
  forwardLabel: "Forward to {instance}",
  unableToLoadStatuses: "Unable to load recent toots: {error}",
  report: "Report",
  noContent: "(No content)",
  noStatuses: "No toots to report",
  // Status options
  unpinFromProfile: "Unpin from profile",
  pinToProfile: "Pin to profile",
  muteConversation: "Mute conversation",
  unmuteConversation: "Unmute conversation",
  bookmarkStatus: "Bookmark toot",
  unbookmarkStatus: "Unbookmark toot",
  deleteAndRedraft: "Delete and redraft",
  reportStatus: "Report toot",
  shareStatus: "Share toot",
  copyLinkToStatus: "Copy link to toot",
  // Account profile
  profileForAccount: "Profile for {account}",
  statisticsAndMoreOptions: "Stats and more options",
  statuses: "Toots",
  follows: "Follows",
  followers: "Followers",
  moreOptions: "More options",
  followersLabel: "Followed by {count}",
  followingLabel: "Follows {count}",
  followLabel: `Follow {requested, select,
    true {(follow requested)}
    other {}
  }`,
  unfollowLabel: `Unfollow {requested, select,
    true {(follow requested)}
    other {}
  }`,
  notify: "Subscribe to {account}",
  denotify: "Unsubscribe from {account}",
  subscribedAccount: "Subscribed to account",
  unsubscribedAccount: "Unsubscribed from account",
  unblock: "Unblock",
  nameAndFollowing: "Name and following",
  clickToSeeAvatar: "Click to see avatar",
  opensInNewWindow: "{label} (opens in new window)",
  blocked: "Blocked",
  domainHidden: "Domain hidden",
  muted: "Muted",
  followsYou: "Follows you",
  avatarForAccount: "Avatar for {account}",
  fields: "Fields",
  accountHasMoved: "{account} has moved:",
  profilePageForAccount: "Profile page for {account}",
  // About page
  about: "About",
  aboutApp: "About Pinafore",
  aboutAppDescription: `
  <p>
    Pinafore is
    <a rel="noopener" target="_blank"
       href="https://github.com/nolanlawson/pinafore">free and open-source software</a>
    created by
    <a rel="noopener" target="_blank" href="https://nolanlawson.com">Nolan Lawson</a>
    and distributed under the
    <a rel="noopener" target="_blank"
       href="https://github.com/nolanlawson/pinafore/blob/master/LICENSE">GNU Affero General Public License</a>.
  </p>

  <h2 id="privacy-policy">Privacy Policy</h2>

  <p>
    Pinafore does not store any personal information on its servers,
    including but not limited to names, email addresses,
    IP addresses, posts, and photos.
  </p>

  <p>
    Pinafore is a static site. All data is stored locally in your browser and shared with the fediverse
    instance(s) you connect to.
  </p>

  <h2>Credits</h2>

  <p>
    Icons provided by <a rel="noopener" target="_blank" href="http://fontawesome.io/">Font Awesome</a>.
  </p>

  <p>
    Logo thanks to "sailboat" by Gregor Cresnar from
    <a rel="noopener" target="_blank" href="https://thenounproject.com/">the Noun Project</a>.
  </p>`,
  // Settings
  settings: "Settings",
  general: "General",
  generalSettings: "General settings",
  showSensitive: "Show sensitive media by default",
  showPlain: "Show a plain gray color for sensitive media",
  allSensitive: "Treat all media as sensitive",
  largeMedia: "Show large inline images and videos",
  autoplayGifs: "Autoplay animated GIFs",
  hideCards: "Hide link preview cards",
  underlineLinks: "Underline links in toots and profiles",
  accessibility: "Accessibility",
  reduceMotion: "Reduce motion in UI animations",
  disableTappable: "Disable tappable area on entire toot",
  removeEmoji: "Remove emoji from user display names",
  shortAria: "Use short article ARIA labels",
  theme: "Theme",
  themeForInstance: "Theme for {instance}",
  disableCustomScrollbars: "Disable custom scrollbars",
  bottomNav: "Place the navigation bar at the bottom of the screen",
  centerNav: "Center the navigation bar",
  preferences: "Preferences",
  hotkeySettings: "Hotkey settings",
  disableHotkeys: "Disable all hotkeys",
  leftRightArrows:
    "Left/right arrow keys change focus rather than columns/media",
  guide: "Guide",
  reload: "Reload",
  // Wellness settings
  wellness: "Wellness",
  wellnessSettings: "Wellness settings",
  wellnessDescription: `Wellness settings are designed to reduce the addictive or anxiety-inducing aspects of social media.
    Choose any options that work well for you.`,
  enableAll: "Enable all",
  metrics: "Metrics",
  hideFollowerCount: "Hide follower counts (capped at 10)",
  hideReblogCount: "Hide boost counts",
  hideFavoriteCount: "Hide favorite counts",
  hideUnread: "Hide unread notifications count (i.e. the red dot)",
  // The quality that makes something seem important or interesting because it seems to be happening now
  immediacy: "Immediacy",
  showAbsoluteTimestamps:
    'Show absolute timestamps (e.g. "March 3rd") instead of relative timestamps (e.g. "5 minutes ago")',
  ui: "UI",
  grayscaleMode: "Grayscale mode",
  wellnessFooter: `These settings are partly based on guidelines from the
    <a rel="noopener" target="_blank" href="https://humanetech.com">Center for Humane Technology</a>.`,
  // This is a link: "You can filter or disable notifications in the _instance settings_"
  filterNotificationsPre: "You can filter or disable notifications in the",
  filterNotificationsText: "instance settings",
  filterNotificationsPost: "",
  // Custom tooltips, like "Disable _infinite scroll_", where you can click _infinite scroll_
  // to see a description. It's hard to properly internationalize, so we just break up the strings.
  disableInfiniteScrollPre: "Disable",
  disableInfiniteScrollText: "infinite scroll",
  disableInfiniteScrollDescription: `When infinite scroll is disabled, new toots will not automatically appear at
             the bottom or top of the timeline. Instead, buttons will allow you to
             load more content on demand.`,
  disableInfiniteScrollPost: "",
  // Instance settings
  loggedInAs: "Logged in as",
  homeTimelineFilters: "Home timeline filters",
  notificationFilters: "Notification filters",
  pushNotifications: "Push notifications",
  // Add instance page
  storageError: `It seems Pinafore cannot store data locally. Is your browser in private mode
          or blocking cookies? Pinafore stores all data locally, and requires LocalStorage and
          IndexedDB to work correctly.`,
  javaScriptError: "You must enable JavaScript to log in.",
  enterInstanceName: "Enter instance name",
  instanceColon: "Instance:",
  // Custom tooltip, concatenated together
  getAnInstancePre: "Don't have an",
  getAnInstanceText: "instance",
  getAnInstanceDescription:
    "An instance is your Mastodon home server, such as mastodon.social or cybre.space.",
  getAnInstancePost: "?",
  joinMastodon: "Join Mastodon!",
  instancesYouveLoggedInTo: "Instances you've logged in to:",
  addAnotherInstance: "Add another instance",
  youreNotLoggedIn: "You're not logged in to any instances.",
  currentInstanceLabel: `{instance} {current, select,
    true {(current instance)}
    other {}
  }`,
  // Link text
  logInToAnInstancePre: "",
  logInToAnInstanceText: "Log in to an instance",
  logInToAnInstancePost: "to start using Pinafore.",
  // Another custom tooltip
  showRingPre: "Always show",
  showRingText: "focus ring",
  showRingDescription: `The focus ring is the outline showing the currently focused element. By default, it's only
    shown when using the keyboard (not mouse or touch), but you may choose to always show it.`,
  showRingPost: "",
  instances: "Instances",
  addInstance: "Add instance",
  homeTimelineFilterSettings: "Home timeline filter settings",
  showReblogs: "Show boosts",
  showReplies: "Show replies",
  switchOrLogOut: "Switch to or log out of this instance",
  switchTo: "Switch to this instance",
  switchToInstance: "Switch to instance",
  switchToNameOfInstance: "Switch to {instance}",
  logOut: "Log out",
  logOutOfInstanceConfirm: "Log out of {instance}?",
  notificationFilterSettings: "Notification filter settings",
  // Push notifications
  browserDoesNotSupportPush: "Your browser doesn't support push notifications.",
  deniedPush: "You have denied permission to show notifications.",
  pushNotificationsNote:
    "Note that you can only have push notifications for one instance at a time.",
  pushSettings: "Push notification settings",
  newFollowers: "New followers",
  reblogs: "Boosts",
  pollResults: "Poll results",
  subscriptions: "Subscribed toots",
  needToReauthenticate:
    "You need to reauthenticate in order to enable push notification. Log out of {instance}?",
  failedToUpdatePush: "Failed to update push notification settings: {error}",
  // Themes
  chooseTheme: "Choose a theme",
  darkBackground: "Dark background",
  lightBackground: "Light background",
  themeLabel: `{label} {default, select,
    true {(default)}
    other {}
  }`,
  animatedImage: "Animated image: {description}",
  showImage: `Show {animated, select,
    true {animated}
    other {}
  } image: {description}`,
  playVideoOrAudio: `Play {audio, select,
    true {audio}
    other {video}
  }: {description}`,
  accountFollowedYou: "{name} followed you, {account}",
  accountSignedUp: "{name} signed up, {account}",
  reblogCountsHidden: "Boost counts hidden",
  favoriteCountsHidden: "Favorite counts hidden",
  rebloggedTimes: `Boosted {count, plural,
    one {1 time}
    other {{count} times}
  }`,
  favoritedTimes: `Favorited {count, plural,
    one {1 time}
    other {{count} times}
  }`,
  pinnedStatus: "Pinned toot",
  rebloggedYou: "boosted your toot",
  favoritedYou: "favorited your toot",
  followedYou: "followed you",
  signedUp: "signed up",
  posted: "posted",
  pollYouCreatedEnded: "A poll you created has ended",
  pollYouVotedEnded: "A poll you voted on has ended",
  reblogged: "boosted",
  favorited: "favorited",
  unreblogged: "unboosted",
  unfavorited: "unfavorited",
  showSensitiveMedia: "Show sensitive media",
  hideSensitiveMedia: "Hide sensitive media",
  clickToShowSensitive: "Sensitive content. Click to show.",
  longPost: "Long post",
  // Accessible status labels
  accountRebloggedYou: "{account} boosted your toot",
  accountFavoritedYou: "{account} favorited your toot",
  rebloggedByAccount: "Boosted by {account}",
  contentWarningContent: "Content warning: {spoiler}",
  hasMedia: "has media",
  hasPoll: "has poll",
  shortStatusLabel: "{privacy} toot by {account}",
  // Privacy types
  public: "Public",
  unlisted: "Unlisted",
  followersOnly: "Followers-only",
  direct: "Direct",
  // Themes
  themeRoyal: "Royal",
  themeScarlet: "Scarlet",
  themeSeafoam: "Seafoam",
  themeHotpants: "Hotpants",
  themeOaken: "Oaken",
  themeMajesty: "Majesty",
  themeGecko: "Gecko",
  themeGrayscale: "Grayscale",
  themeOzark: "Ozark",
  themeCobalt: "Cobalt",
  themeSorcery: "Sorcery",
  themePunk: "Punk",
  themeRiot: "Riot",
  themeHacker: "Hacker",
  themeMastodon: "Mastodon",
  themePitchBlack: "Pitch Black",
  themeDarkGrayscale: "Dark Grayscale",
  // Polls
  voteOnPoll: "Vote on poll",
  pollChoices: "Poll choices",
  vote: "Vote",
  pollDetails: "Poll details",
  refresh: "Refresh",
  expires: "Ends",
  expired: "Ended",
  voteCount: `{count, plural,
    one {1 vote}
    other {{count} votes}
  }`,
  // Status interactions
  clickToShowThread: "{time} - click to show thread",
  showMore: "Show more",
  showLess: "Show less",
  closeReply: "Close reply",
  cannotReblogFollowersOnly: "Cannot be boosted because this is followers-only",
  cannotReblogDirectMessage:
    "Cannot be boosted because this is a direct message",
  reblog: "Boost",
  reply: "Reply",
  replyToThread: "Reply to thread",
  favorite: "Favorite",
  unfavorite: "Unfavorite",
  // timeline
  loadingMore: "Loading more…",
  loadMore: "Load more",
  showCountMore: "Show {count} more",
  nothingToShow: "Nothing to show.",
  // status thread page
  statusThreadPage: "Toot thread page",
  status: "Toot",
  // toast messages
  blockedAccount: "Blocked account",
  unblockedAccount: "Unblocked account",
  unableToBlock: "Unable to block account: {error}",
  unableToUnblock: "Unable to unblock account: {error}",
  bookmarkedStatus: "Bookmarked toot",
  unbookmarkedStatus: "Unbookmarked toot",
  unableToBookmark: "Unable to bookmark: {error}",
  unableToUnbookmark: "Unable to unbookmark: {error}",
  cannotPostOffline: "You cannot post while offline",
  unableToPost: "Unable to post toot: {error}",
  statusDeleted: "Toot deleted",
  unableToDelete: "Unable to delete toot: {error}",
  cannotFavoriteOffline: "You cannot favorite while offline",
  cannotUnfavoriteOffline: "You cannot unfavorite while offline",
  unableToFavorite: "Unable to favorite: {error}",
  unableToUnfavorite: "Unable to unfavorite: {error}",
  followedAccount: "Followed account",
  unfollowedAccount: "Unfollowed account",
  unableToFollow: "Unable to follow account: {error}",
  unableToUnfollow: "Unable to unfollow account: {error}",
  accessTokenRevoked: "The access token was revoked, logged out of {instance}",
  loggedOutOfInstance: "Logged out of {instance}",
  failedToUploadMedia: "Failed to upload media: {error}",
  mutedAccount: "Muted account",
  unmutedAccount: "Unmuted account",
  unableToMute: "Unable to mute account: {error}",
  unableToUnmute: "Unable to unmute account: {error}",
  mutedConversation: "Muted conversation",
  unmutedConversation: "Unmuted conversation",
  unableToMuteConversation: "Unable to mute conversation: {error}",
  unableToUnmuteConversation: "Unable to unmute conversation: {error}",
  unpinnedStatus: "Unpinned toot",
  unableToPinStatus: "Unable to pin toot: {error}",
  unableToUnpinStatus: "Unable to unpin toot: {error}",
  unableToRefreshPoll: "Unable to refresh poll: {error}",
  unableToVoteInPoll: "Unable to vote in poll: {error}",
  cannotReblogOffline: "You cannot boost while offline.",
  cannotUnreblogOffline: "You cannot unboost while offline.",
  failedToReblog: "Failed to boost: {error}",
  failedToUnreblog: "Failed to unboost: {error}",
  submittedReport: "Submitted report",
  failedToReport: "Failed to report: {error}",
  approvedFollowRequest: "Approved follow request",
  rejectedFollowRequest: "Rejected follow request",
  unableToApproveFollowRequest: "Unable to approve follow request: {error}",
  unableToRejectFollowRequest: "Unable to reject follow request: {error}",
  searchError: "Error during search: {error}",
  hidDomain: "Hid domain",
  unhidDomain: "Unhid domain",
  unableToHideDomain: "Unable to hide domain: {error}",
  unableToUnhideDomain: "Unable to unhide domain: {error}",
  showingReblogs: "Showing boosts",
  hidingReblogs: "Hiding boosts",
  unableToShowReblogs: "Unable to show boosts: {error}",
  unableToHideReblogs: "Unable to hide boosts: {error}",
  unableToShare: "Unable to share: {error}",
  unableToSubscribe: "Unable to subscribe: {error}",
  unableToUnsubscribe: "Unable to unsubscribe: {error}",
  showingOfflineContent: "Internet request failed. Showing offline content.",
  youAreOffline:
    "You seem to be offline. You can still read toots while offline.",
  // Snackbar UI
  updateAvailable: "App update available.",
  // Word/phrase filters
  wordFilters: "Word filters",
  noFilters: "You don't have any word filters.",
  wordOrPhrase: "Word or phrase",
  contexts: "Contexts",
  addFilter: "Add filter",
  editFilter: "Edit filter",
  filterHome: "Home and lists",
  filterNotifications: "Notifications",
  filterPublic: "Public timelines",
  filterThread: "Conversations",
  filterAccount: "Profiles",
  filterUnknown: "Unknown",
  expireAfter: "Expire after",
  whereToFilter: "Where to filter",
  irreversible: "Irreversible",
  wholeWord: "Whole word",
  save: "Save",
  updatedFilter: "Updated filter",
  createdFilter: "Created filter",
  failedToModifyFilter: "Failed to modify filter: {error}",
  deletedFilter: "Deleted filter",
  required: "Required",
  // Dialogs
  profileOptions: "Profile options",
  copyLink: "Copy link",
  emoji: "Emoji",
  editMedia: "Edit media",
  shortcutHelp: "Shortcut help",
  statusOptions: "Status options",
  confirm: "Confirm",
  closeDialog: "Close dialog",
  postPrivacy: "Post privacy",
  homeOnInstance: "Home on {instance}",
  statusesTimelineOnInstance: "Statuses: {timeline} timeline on {instance}",
  statusesHashtag: "Statuses: #{hashtag} hashtag",
  statusesThread: "Statuses: thread",
  statusesAccountTimeline: "Statuses: account timeline",
  statusesList: "Statuses: list",
  notificationsOnInstance: "Notifications on {instance}",
};
