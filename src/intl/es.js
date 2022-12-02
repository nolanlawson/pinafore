export default {
  // Home page, basic <title> and <description>
  appName: 'Pinafore',
  appDescription: 'Un cliente web alternativo para Mastodon, centrado en la velocidad y la sencillez.',
  homeDescription: `
    <p>
      Pinafore es un cliente web para
      <a rel="noopener" target="_blank" href="https://joinmastodon.org">Mastodon</a>,
      diseñado para ser rápido y sencillo.
    </p>
    <p>
      Lee el
      <a rel="noopener" target="_blank"
         href="https://nolanlawson.com/2018/04/09/introducing-pinafore-for-mastodon/">artículo introductorio en el blog</a>,
      o comienza iniciando sesión en una instancia:
    </p>`,
  logIn: 'Iniciar sesión',
  footer: `
    <p>
      Pinafore es
      <a rel="noopener" target="_blank" href="https://github.com/nolanlawson/pinafore">software de código abierto</a>
      creado por
      <a rel="noopener" target="_blank" href="https://nolanlawson.com">Nolan Lawson</a>
      y distribuido bajo la
      <a rel="noopener" target="_blank"
         href="https://github.com/nolanlawson/pinafore/blob/master/LICENSE">Licencia AGPL</a>.
      Aquí está la <a href="/settings/about#privacy-policy" rel="prefetch">política de privacidad</a>.
    </p>
  `,
  // Manifest
  longAppName: 'Pinafore para Mastodon',
  newStatus: 'Nuevo toot',
  // Generic UI
  loading: 'Cargando',
  okay: 'OK',
  cancel: 'Cancelar',
  alert: 'Alerta',
  close: 'Cerrar',
  error: 'Error: {error}',
  errorShort: 'Error:',
  // Relative timestamps
  justNow: 'ahora mismo',
  // Navigation, page titles
  navItemLabel: `
    {label} {selected, select,
      true {(página actual)}
      other {}
    } {name, select,
      notifications {{count, plural,
        =0 {}
        one {(1 notificación)}
        other {({count} notificaciones)}
      }}
      community {{count, plural,
        =0 {}
        one {(1 solicitud de seguimiento)}
        other {({count} solicitudes de seguimiento)}
      }}
      other {}
    }
  `,
  blockedUsers: 'Usuarios bloqueados',
  bookmarks: 'Marcadores',
  directMessages: 'Mensajes directos',
  favorites: 'Favoritos',
  federated: 'Federada',
  home: 'Inicio',
  local: 'Local',
  notifications: 'Notificaciones',
  mutedUsers: 'Usuarios silenciados',
  pinnedStatuses: 'Toots fijados',
  followRequests: 'Solicitudes de seguimiento',
  followRequestsLabel: `Solicitudes de seguimiento {hasFollowRequests, select,
    true {({count})}
    other {}
  }`,
  list: 'Lista',
  search: 'Buscar',
  pageHeader: 'Encabezado de página',
  goBack: 'Retroceder',
  back: 'Atrás',
  profile: 'Perfil',
  federatedTimeline: 'Cronología federada',
  localTimeline: 'Cronología local',
  // community page
  community: 'Comunidad',
  pinnableTimelines: 'Cronologías que puedes fijar',
  timelines: 'Cronologías',
  lists: 'Listas',
  instanceSettings: 'Configuración de instancia',
  notificationMentions: 'Notificación de menciones',
  profileWithMedia: 'Perfil con multimedia',
  profileWithReplies: 'Perfil con respuestas',
  hashtag: 'Hashtag',
  // not logged in
  profileNotLoggedIn: 'Aquí se mostrará una cronología de usuario cuando hayas iniciado sesión.',
  bookmarksNotLoggedIn: 'Tus marcadores se mostrarán aquí cuando hayas iniciado sesión.',
  directMessagesNotLoggedIn: 'Tus mensajes directos se mostrarán aquí cuando hayas iniciado sesión.',
  favoritesNotLoggedIn: 'Tus favoritos se mostrarán aquí cuando hayas iniciado sesión.',
  federatedTimelineNotLoggedIn: 'Tu cronología federada se mostrará aquí cuando hayas iniciado sesión.',
  localTimelineNotLoggedIn: 'Tu cronología localse mostrará aquí cuando hayas iniciado sesión.',
  searchNotLoggedIn: 'Puedes buscar una vez que inicias sesión en una instancia.',
  communityNotLoggedIn: 'Las opciones para comunidad se mostrarán aquí cuando hayas iniciado sesión.',
  listNotLoggedIn: 'Aquí se mostrará una lista cuando hayas iniciado sesión.',
  notificationsNotLoggedIn: 'Tus notificaciones se mostrarán aquí cuando hayas iniciado sesión.',
  notificationMentionsNotLoggedIn: 'Las notificaciones de tus menciones se mostrarán aquí cuando hayas iniciado sesión.',
  statusNotLoggedIn: 'Aquí se mostrará un hilo de toots cuando hayas iniciado sesión.',
  tagNotLoggedIn: 'Aquí se mostrará una cronología de hashtags cuando hayas iniciado sesión.',
  // Notification subpages
  filters: 'Filtros',
  all: 'Todo',
  mentions: 'Menciones',
  // Follow requests
  approve: 'Aceptar',
  reject: 'Rechazar',
  // Hotkeys
  hotkeys: 'Atajos de teclado',
  global: 'Globales',
  timeline: 'Cronología',
  media: 'Multimedia',
  globalHotkeys: `
    {leftRightChangesFocus, select,
      true {
        <li><kbd>→</kbd> para ir al elemento enfocable siguiente</li>
        <li><kbd>←</kbd> para ir al elemento enfocable anterior</li>
      }
      other {}
    }
    <li>
      <kbd>1</kbd> - <kbd>6</kbd>
      {leftRightChangesFocus, select,
        true {}
        other {o <kbd>←</kbd>/<kbd>→</kbd>}
      }
      para cambiar de columna
    </li>
    <li><kbd>7</kbd> o <kbd>c</kbd> para redactar un nuevo toot</li>
    <li><kbd>s</kbd> o <kbd>/</kbd> para buscar</li>
    <li><kbd>g</kbd> + <kbd>h</kbd> para ir a inicio</li>
    <li><kbd>g</kbd> + <kbd>n</kbd> para ir a notificaciones</li>
    <li><kbd>g</kbd> + <kbd>l</kbd> to para ir a la cronología local</li>
    <li><kbd>g</kbd> + <kbd>t</kbd> para ir a la cronología federada</li>
    <li><kbd>g</kbd> + <kbd>c</kbd> para ir a la página comunidad</li>
    <li><kbd>g</kbd> + <kbd>d</kbd> para ir a la página de mensajes directos</li>
    <li><kbd>h</kbd> o <kbd>?</kbd> para abrir o cerrar el diálogo de ayuda</li>
    <li><kbd>Backspace</kbd> para retroceder, cerrar diálogos</li>
  `,
  timelineHotkeys: `
    <li><kbd>j</kbd> o <kbd>↓</kbd> para activar el toot siguiente</li>
    <li><kbd>k</kbd> o <kbd>↑</kbd> para activar el toot anterior</li>
    <li><kbd>.</kbd> para mostrar más y desplazarse al principio</li>
    <li><kbd>o</kbd> para abrir</li>
    <li><kbd>f</kbd> para marcar como favorito</li>
    <li><kbd>b</kbd> para impulsar</li>
    <li><kbd>r</kbd> para responder</li>
    <li><kbd>i</kbd> para abrir imágenes, vídeo o audio</li>
    <li><kbd>y</kbd> para mostrar u ocultar multimedia sensible</li>
    <li><kbd>m</kbd> para mencionar al autor</li>
    <li><kbd>p</kbd> para abrir el perfil del autor</li>
    <li><kbd>l</kbd> para abrir el enlace de la publicación en una nueva pestaña</li>
    <li><kbd>x</kbd> para mostrar u ocultar el texto tras una advertencia de contenido</li>
    <li><kbd>z</kbd> para mostrar u ocultar todas las advertencias de contenido en un hilo</li>
  `,
  mediaHotkeys: `
    <li><kbd>←</kbd> / <kbd>→</kbd> para ir a siguiente o anterior</li>
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
        true {(página fijada)}
        other {(Página no fijada)}
      }
    }
    other {}
  }`,
  pinPage: 'Fijar {label}',
  // Status composition
  overLimit: '{count} {count, plural, =1 {carácter} other {caracteres}} más de la cuenta',
  underLimit: '{count} {count, plural, =1 {carácter} other {caracteres}} para el máximo',
  composeStatus: 'Redactar toot',
  postStatus: 'Toot!',
  contentWarning: 'Advertencia de contenido',
  dropToUpload: 'Soltar para subir',
  invalidFileType: 'Tipo de fichero no válido',
  composeLabel: "¿En qué estás pensando?",
  autocompleteDescription: 'Cuando haya disponibles resultados de autocompletado, pulsa las flechas arriba o abajo y enter para seleccionar.',
  mediaUploads: 'Subidas multimedia',
  edit: 'Editar',
  delete: 'Borrar',
  description: 'Descripción',
  descriptionLabel: 'Describir para las personas con discapacidad visual (imagen, vídeo) o con discapacidad auditiva (audio, vídeo)',
  markAsSensitive: 'Marcar multimedia como sensible',
  // Polls
  createPoll: 'Crear encuesta',
  removePollChoice: 'Eliminar opción {index}',
  pollChoiceLabel: 'Opción {index}',
  multipleChoice: 'Selección múltiple',
  pollDuration: 'Duración de la encuesta',
  fiveMinutes: '5 minutos',
  thirtyMinutes: '30 minutos',
  oneHour: '1 hora',
  sixHours: '6 horas',
  twelveHours: '12 horas',
  oneDay: '1 día',
  threeDays: '3 días',
  sevenDays: '7 días',
  never: 'Nunca',
  addEmoji: 'Insertar emoji',
  addMedia: 'Añadir media (imágenes, vídeo, audio)',
  addPoll: 'Añadir encuesta',
  removePoll: 'Eliminar encuesta',
  postPrivacyLabel: 'Ajustar privacidad (actualmente {label})',
  addContentWarning: 'Añadir advertencia de contenido',
  removeContentWarning: 'Eliminar advertencia de contenido',
  altLabel: 'Describir para las personas con discapacidad visual',
  extractText: 'Extraer texto de imagen',
  extractingText: 'Extrayendo texto…',
  extractingTextCompletion: 'Extrayendo texto ({percent}% completado)…',
  unableToExtractText: 'No se puede extraer texto.',
  // Account options
  followAccount: 'Seguir a {account}',
  unfollowAccount: 'Dejar de seguir a {account}',
  blockAccount: 'Bloquear a {account}',
  unblockAccount: 'Desbloquear a {account}',
  muteAccount: 'Silenciar a {account}',
  unmuteAccount: 'Dejar de silenciar a Unmute {account}',
  showReblogsFromAccount: 'Mostrar toots reenviados por {account}',
  hideReblogsFromAccount: 'Ocultar toots reenviados por {account}',
  showDomain: 'Dejar de ocultar {domain}',
  hideDomain: 'Ocultar {domain}',
  reportAccount: 'Denunciar a {account}',
  mentionAccount: 'Mencionar a {account}',
  copyLinkToAccount: 'Copiar enlace a cuenta',
  copiedToClipboard: 'Copiado al portapapeles',
  // Media dialog
  navigateMedia: 'Navegar por elementos multimedia',
  showPreviousMedia: 'Mostrar multimedia anterior',
  showNextMedia: 'Mostrar multimedia siguiente',
  enterPinchZoom: 'Modo encoger',
  exitPinchZoom: 'Exit pinch-zoom mode',
  showMedia: `Show {index, select,
    1 {primero}
    2 {segundo}
    3 {tercero}
    other {cuarto}
  } media {current, select,
    true {(actual)}
    other {}
  }`,
  previewFocalPoint: 'Previsualizar (punto focal)',
  enterFocalPoint: 'Introducir el punto focal (X, Y) para este multimedia',
  muteNotifications: 'Silenciar también las notificaciones',
  muteAccountConfirm: '¿Silenciar a {account}?',
  mute: 'Silenciar',
  unmute: 'Dejar de silenciar',
  zoomOut: 'Alejar',
  zoomIn: 'Acercar',
  // Reporting
  reportingLabel: 'Estás denunciando a {account} a los moderadores de {instance}.',
  additionalComments: 'Comentarios adicionales',
  forwardDescription: '?Reenviar también a los moderadores de {instance}?',
  forwardLabel: 'Reenviar a {instance}',
  unableToLoadStatuses: 'No se pueden cargar los toots recientes: {error}',
  report: 'Denunciar',
  noContent: '(Sin contenido)',
  noStatuses: 'No hay toots para denunciar',
  // Status options
  unpinFromProfile: 'Unpin from profile',
  pinToProfile: 'Pin to profile',
  muteConversation: 'Mute conversation',
  unmuteConversation: 'Unmute conversation',
  bookmarkStatus: 'Bookmark toot',
  unbookmarkStatus: 'Unbookmark toot',Comentarios adicionales
  deleteAndRedraft: 'Delete and redraft',
  reportStatus: 'Report toot',
  shareStatus: 'Share toot',
  copyLinkToStatus: 'Copy link to toot',
  // Account profile
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
  notify: 'Subscribe to {account}',
  denotify: 'Unsubscribe from {account}',
  subscribedAccount: 'Subscribed to account',
  unsubscribedAccount: 'Unsubscribed from account',
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
  // About page
  about: 'About',
  aboutApp: 'About Pinafore',
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
  settings: 'Settings',
  general: 'General',
  generalSettings: 'General settings',
  showSensitive: 'Show sensitive media by default',
  showPlain: 'Show a plain gray color for sensitive media',
  allSensitive: 'Treat all media as sensitive',
  largeMedia: 'Show large inline images and videos',
  autoplayGifs: 'Autoplay animated GIFs',
  hideCards: 'Hide link preview cards',
  underlineLinks: 'Underline links in toots and profiles',
  accessibility: 'Accessibility',
  reduceMotion: 'Reduce motion in UI animations',
  disableTappable: 'Disable tappable area on entire toot',
  removeEmoji: 'Remove emoji from user display names',
  shortAria: 'Use short article ARIA labels',
  theme: 'Theme',
  themeForInstance: 'Theme for {instance}',
  disableCustomScrollbars: 'Disable custom scrollbars',
  bottomNav: 'Place the navigation bar at the bottom of the screen',
  centerNav: 'Center the navigation bar',
  preferences: 'Preferences',
  hotkeySettings: 'Hotkey settings',
  disableHotkeys: 'Disable all hotkeys',
  leftRightArrows: 'Left/right arrow keys change focus rather than columns/media',
  guide: 'Guide',
  reload: 'Reload',
  // Wellness settings
  wellness: 'Wellness',
  wellnessSettings: 'Wellness settings',
  wellnessDescription: `Wellness settings are designed to reduce the addictive or anxiety-inducing aspects of social media.
    Choose any options that work well for you.`,
  enableAll: 'Enable all',
  metrics: 'Metrics',
  hideFollowerCount: 'Hide follower counts (capped at 10)',
  hideReblogCount: 'Hide boost counts',
  hideFavoriteCount: 'Hide favorite counts',
  hideUnread: 'Hide unread notifications count (i.e. the red dot)',
  // The quality that makes something seem important or interesting because it seems to be happening now
  immediacy: 'Immediacy',
  showAbsoluteTimestamps: 'Show absolute timestamps (e.g. "March 3rd") instead of relative timestamps (e.g. "5 minutes ago")',
  ui: 'UI',
  grayscaleMode: 'Grayscale mode',
  wellnessFooter: `These settings are partly based on guidelines from the
    <a rel="noopener" target="_blank" href="https://humanetech.com">Center for Humane Technology</a>.`,
  // This is a link: "You can filter or disable notifications in the _instance settings_"
  filterNotificationsPre: 'You can filter or disable notifications in the',
  filterNotificationsText: 'instance settings',
  filterNotificationsPost: '',
  // Custom tooltips, like "Disable _infinite scroll_", where you can click _infinite scroll_
  // to see a description. It's hard to properly internationalize, so we just break up the strings.
  disableInfiniteScrollPre: 'Disable',
  disableInfiniteScrollText: 'infinite scroll',
  disableInfiniteScrollDescription: `When infinite scroll is disabled, new toots will not automatically appear at
             the bottom or top of the timeline. Instead, buttons will allow you to
             load more content on demand.`,
  disableInfiniteScrollPost: '',
  // Instance settings
  loggedInAs: 'Logged in as',
  homeTimelineFilters: 'Home timeline filters',
  notificationFilters: 'Notification filters',
  pushNotifications: 'Push notifications',
  // Add instance page
  storageError: `It seems Pinafore cannot store data locally. Is your browser in private mode
          or blocking cookies? Pinafore stores all data locally, and requires LocalStorage and
          IndexedDB to work correctly.`,
  javaScriptError: 'You must enable JavaScript to log in.',
  enterInstanceName: 'Enter instance name',
  instanceColon: 'Instance:',
  // Custom tooltip, concatenated together
  getAnInstancePre: "Don't have an",
  getAnInstanceText: 'instance',
  getAnInstanceDescription: 'An instance is your Mastodon home server, such as mastodon.social or cybre.space.',
  getAnInstancePost: '?',
  joinMastodon: 'Join Mastodon!',
  instancesYouveLoggedInTo: "Instances you've logged in to:",
  addAnotherInstance: 'Add another instance',
  youreNotLoggedIn: "You're not logged in to any instances.",
  currentInstanceLabel: `{instance} {current, select,
    true {(current instance)}
    other {}
  }`,
  // Link text
  logInToAnInstancePre: '',
  logInToAnInstanceText: 'Log in to an instance',
  logInToAnInstancePost: 'to start using Pinafore.',
  // Another custom tooltip
  showRingPre: 'Always show',
  showRingText: 'focus ring',
  showRingDescription: `The focus ring is the outline showing the currently focused element. By default, it's only
    shown when using the keyboard (not mouse or touch), but you may choose to always show it.`,
  showRingPost: '',
  instances: 'Instances',
  addInstance: 'Add instance',
  homeTimelineFilterSettings: 'Home timeline filter settings',
  showReblogs: 'Show boosts',
  showReplies: 'Show replies',
  switchOrLogOut: 'Switch to or log out of this instance',
  switchTo: 'Switch to this instance',
  switchToInstance: 'Switch to instance',
  switchToNameOfInstance: 'Switch to {instance}',
  logOut: 'Log out',
  logOutOfInstanceConfirm: 'Log out of {instance}?',
  notificationFilterSettings: 'Notification filter settings',
  // Push notifications
  browserDoesNotSupportPush: "Your browser doesn't support push notifications.",
  deniedPush: 'You have denied permission to show notifications.',
  pushNotificationsNote: 'Note that you can only have push notifications for one instance at a time.',
  pushSettings: 'Push notification settings',
  newFollowers: 'New followers',
  reblogs: 'Boosts',
  pollResults: 'Poll results',
  subscriptions: 'Subscribed toots',
  needToReauthenticate: 'You need to reauthenticate in order to enable push notification. Log out of {instance}?',
  failedToUpdatePush: 'Failed to update push notification settings: {error}',
  // Themes
  chooseTheme: 'Choose a theme',
  darkBackground: 'Dark background',
  lightBackground: 'Light background',
  themeLabel: `{label} {default, select,
    true {(default)}
    other {}
  }`,
  animatedImage: 'Animated image: {description}',
  showImage: `Show {animated, select,
    true {animated}
    other {}
  } image: {description}`,
  playVideoOrAudio: `Play {audio, select,
    true {audio}
    other {video}
  }: {description}`,
  accountFollowedYou: '{name} followed you, {account}',
  accountSignedUp: '{name} signed up, {account}',
  reblogCountsHidden: 'Boost counts hidden',
  favoriteCountsHidden: 'Favorite counts hidden',
  rebloggedTimes: `Boosted {count, plural,
    one {1 time}
    other {{count} times}
  }`,
  favoritedTimes: `Favorited {count, plural,
    one {1 time}
    other {{count} times}
  }`,
  pinnedStatus: 'Pinned toot',
  rebloggedYou: 'boosted your toot',
  favoritedYou: 'favorited your toot',
  followedYou: 'followed you',
  signedUp: 'signed up',
  posted: 'posted',
  pollYouCreatedEnded: 'A poll you created has ended',
  pollYouVotedEnded: 'A poll you voted on has ended',
  reblogged: 'boosted',
  favorited: 'favorited',
  unreblogged: 'unboosted',
  unfavorited: 'unfavorited',
  showSensitiveMedia: 'Show sensitive media',
  hideSensitiveMedia: 'Hide sensitive media',
  clickToShowSensitive: 'Sensitive content. Click to show.',
  longPost: 'Long post',
  // Accessible status labels
  accountRebloggedYou: '{account} boosted your toot',
  accountFavoritedYou: '{account} favorited your toot',
  rebloggedByAccount: 'Boosted by {account}',
  contentWarningContent: 'Content warning: {spoiler}',
  hasMedia: 'has media',
  hasPoll: 'has poll',
  shortStatusLabel: '{privacy} toot by {account}',
  // Privacy types
  public: 'Public',
  unlisted: 'Unlisted',
  followersOnly: 'Followers-only',
  direct: 'Direct',
  // Themes
  themeRoyal: 'Royal',
  themeScarlet: 'Scarlet',
  themeSeafoam: 'Seafoam',
  themeHotpants: 'Hotpants',
  themeOaken: 'Oaken',
  themeMajesty: 'Majesty',
  themeGecko: 'Gecko',
  themeGrayscale: 'Grayscale',
  themeOzark: 'Ozark',
  themeCobalt: 'Cobalt',
  themeSorcery: 'Sorcery',
  themePunk: 'Punk',
  themeRiot: 'Riot',
  themeHacker: 'Hacker',
  themeMastodon: 'Mastodon',
  themePitchBlack: 'Pitch Black',
  themeDarkGrayscale: 'Dark Grayscale',
  // Polls
  voteOnPoll: 'Vote on poll',
  pollChoices: 'Poll choices',
  vote: 'Vote',
  pollDetails: 'Poll details',
  refresh: 'Refresh',
  expires: 'Ends',
  expired: 'Ended',
  voteCount: `{count, plural,
    one {1 vote}
    other {{count} votes}
  }`,
  // Status interactions
  clickToShowThread: '{time} - click to show thread',
  showMore: 'Show more',
  showLess: 'Show less',
  closeReply: 'Close reply',
  cannotReblogFollowersOnly: 'Cannot be boosted because this is followers-only',
  cannotReblogDirectMessage: 'Cannot be boosted because this is a direct message',
  reblog: 'Boost',
  reply: 'Reply',
  replyToThread: 'Reply to thread',
  favorite: 'Favorite',
  unfavorite: 'Unfavorite',
  // timeline
  loadingMore: 'Loading more…',
  loadMore: 'Load more',
  showCountMore: 'Show {count} more',
  nothingToShow: 'Nothing to show.',
  // status thread page
  statusThreadPage: 'Toot thread page',
  status: 'Toot',
  // toast messages
  blockedAccount: 'Blocked account',
  unblockedAccount: 'Unblocked account',
  unableToBlock: 'Unable to block account: {error}',
  unableToUnblock: 'Unable to unblock account: {error}',
  bookmarkedStatus: 'Bookmarked toot',
  unbookmarkedStatus: 'Unbookmarked toot',
  unableToBookmark: 'Unable to bookmark: {error}',
  unableToUnbookmark: 'Unable to unbookmark: {error}',
  cannotPostOffline: 'You cannot post while offline',
  unableToPost: 'Unable to post toot: {error}',
  statusDeleted: 'Toot deleted',
  unableToDelete: 'Unable to delete toot: {error}',
  cannotFavoriteOffline: 'You cannot favorite while offline',
  cannotUnfavoriteOffline: 'You cannot unfavorite while offline',
  unableToFavorite: 'Unable to favorite: {error}',
  unableToUnfavorite: 'Unable to unfavorite: {error}',
  followedAccount: 'Followed account',
  unfollowedAccount: 'Unfollowed account',
  unableToFollow: 'Unable to follow account: {error}',
  unableToUnfollow: 'Unable to unfollow account: {error}',
  accessTokenRevoked: 'The access token was revoked, logged out of {instance}',
  loggedOutOfInstance: 'Logged out of {instance}',
  failedToUploadMedia: 'Failed to upload media: {error}',
  mutedAccount: 'Muted account',
  unmutedAccount: 'Unmuted account',
  unableToMute: 'Unable to mute account: {error}',
  unableToUnmute: 'Unable to unmute account: {error}',
  mutedConversation: 'Muted conversation',
  unmutedConversation: 'Unmuted conversation',
  unableToMuteConversation: 'Unable to mute conversation: {error}',
  unableToUnmuteConversation: 'Unable to unmute conversation: {error}',
  unpinnedStatus: 'Unpinned toot',
  unableToPinStatus: 'Unable to pin toot: {error}',
  unableToUnpinStatus: 'Unable to unpin toot: {error}',
  unableToRefreshPoll: 'Unable to refresh poll: {error}',
  unableToVoteInPoll: 'Unable to vote in poll: {error}',
  cannotReblogOffline: 'You cannot boost while offline.',
  cannotUnreblogOffline: 'You cannot unboost while offline.',
  failedToReblog: 'Failed to boost: {error}',
  failedToUnreblog: 'Failed to unboost: {error}',
  submittedReport: 'Submitted report',
  failedToReport: 'Failed to report: {error}',
  approvedFollowRequest: 'Approved follow request',
  rejectedFollowRequest: 'Rejected follow request',
  unableToApproveFollowRequest: 'Unable to approve follow request: {error}',
  unableToRejectFollowRequest: 'Unable to reject follow request: {error}',
  searchError: 'Error during search: {error}',
  hidDomain: 'Hid domain',
  unhidDomain: 'Unhid domain',
  unableToHideDomain: 'Unable to hide domain: {error}',
  unableToUnhideDomain: 'Unable to unhide domain: {error}',
  showingReblogs: 'Showing boosts',
  hidingReblogs: 'Hiding boosts',
  unableToShowReblogs: 'Unable to show boosts: {error}',
  unableToHideReblogs: 'Unable to hide boosts: {error}',
  unableToShare: 'Unable to share: {error}',
  unableToSubscribe: 'Unable to subscribe: {error}',
  unableToUnsubscribe: 'Unable to unsubscribe: {error}',
  showingOfflineContent: 'Internet request failed. Showing offline content.',
  youAreOffline: 'You seem to be offline. You can still read toots while offline.',
  // Snackbar UI
  updateAvailable: 'App update available.',
  // Word/phrase filters
  wordFilters: 'Word filters',
  noFilters: 'You don\'t have any word filters.',
  wordOrPhrase: 'Word or phrase',
  contexts: 'Contexts',
  addFilter: 'Add filter',
  editFilter: 'Edit filter',
  filterHome: 'Home and lists',
  filterNotifications: 'Notifications',
  filterPublic: 'Public timelines',
  filterThread: 'Conversations',
  filterAccount: 'Profiles',
  filterUnknown: 'Unknown',
  expireAfter: 'Expire after',
  whereToFilter: 'Where to filter',
  irreversible: 'Irreversible',
  wholeWord: 'Whole word',
  save: 'Save',
  updatedFilter: 'Updated filter',
  createdFilter: 'Created filter',
  failedToModifyFilter: 'Failed to modify filter: {error}',
  deletedFilter: 'Deleted filter',
  required: 'Required',
  // Dialogs
  profileOptions: 'Profile options',
  copyLink: 'Copy link',
  emoji: 'Emoji',
  editMedia: 'Edit media',
  shortcutHelp: 'Shortcut help',
  statusOptions: 'Status options',
  confirm: 'Confirm',
  closeDialog: 'Close dialog',
  postPrivacy: 'Post privacy',
  homeOnInstance: 'Home on {instance}',
  statusesTimelineOnInstance: 'Statuses: {timeline} timeline on {instance}',
  statusesHashtag: 'Statuses: #{hashtag} hashtag',
  statusesThread: 'Statuses: thread',
  statusesAccountTimeline: 'Statuses: account timeline',
  statusesList: 'Statuses: list',
  notificationsOnInstance: 'Notifications on {instance}'
}
