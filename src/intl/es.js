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
  instanceSettings: 'Opciones para instancia',
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
    <li><kbd>b</kbd> para reenviar</li>
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
  unpinFromProfile: 'Dejar de fijar en el perfil',
  pinToProfile: 'Fijar en el perfil',
  muteConversation: 'Silenciar conversación',
  unmuteConversation: 'Dejar de silenciar conversación',
  bookmarkStatus: 'Poner marcador al toot',
  unbookmarkStatus: 'Quitar marcador al toot',
  deleteAndRedraft: 'Borrar y volver a redactar',
  reportStatus: 'Denunciar toot',
  shareStatus: 'Compartir toot',
  copyLinkToStatus: 'Copiar enlace al toot',
  // Account profile
  profileForAccount: 'Perfil para {account}',
  statisticsAndMoreOptions: 'Estadísticas y más opciones',
  statuses: 'Toots',
  follows: 'Siguiendo',
  followers: 'Seguidores',
  moreOptions: 'Más opciones',
  followersLabel: '{count} te ha seguido',
  followingLabel: 'Has seguido a {count}',
  followLabel: `Seguimiento {requested, select,
    true {(solicitud de seguimiento)}
    other {}
  }`,
  unfollowLabel: `Dejar de seguir {requested, select,
    true {(solicitud de seguimiento)}
    other {}
  }`,
  notify: 'Suscribirse a {account}',
  denotify: 'Cancelar suscripción a {account}',
  subscribedAccount: 'Te has suscrito a la cuenta',
  unsubscribedAccount: 'Has cancelado tu suscripción a la cuenta',
  unblock: 'Desbloquear',
  nameAndFollowing: 'Nombre y seguimientos',
  clickToSeeAvatar: 'Haz clic para ver el avatar',
  opensInNewWindow: '{label} (Se abre en nueva ventana)',
  blocked: 'Bloqueado',
  domainHidden: 'Dominio oculto',
  muted: 'Silenciado',
  followsYou: 'Te está siguiendo',
  avatarForAccount: 'Avatar para {account}',
  fields: 'Campos',
  accountHasMoved: '{account} se ha trasladado:',
  profilePageForAccount: 'Página de perfil para {account}',
  // About page
  about: 'Acerca de',
  aboutApp: 'Acerca de Pinafore',
  aboutAppDescription: `
  <p>
    Pinafore es
    <a rel="noopener" target="_blank"
       href="https://github.com/nolanlawson/pinafore">software libre y de código abierto</a>
    creado por
    <a rel="noopener" target="_blank" href="https://nolanlawson.com">Nolan Lawson</a>
    y distribuido bajo la
    <a rel="noopener" target="_blank"
       href="https://github.com/nolanlawson/pinafore/blob/master/LICENSE">GNU Affero General Public License</a>.
  </p>

  <h2 id="privacy-policy">Política de privacidad</h2>

  <p>
    Pinafore no almacena ninguna información personal en sus servidores,
    incluyendo, pero no limitándose a nombres, direcciones de correo electrónico,
    direcciones IP, posts y fotos.
  </p>

  <p>
    Pinafore es un sitio estático. Todos los datos son almacenados en tu navegador y compartidos con las instancias del fediverso
    a las que te conectas.
  </p>

  <h2>Créditos</h2>

  <p>
    Iconos proporcionados por <a rel="noopener" target="_blank" href="http://fontawesome.io/">Font Awesome</a>.
  </p>

  <p>
    Logo gracias a "sailboat" por Gregor Cresnar, de
    <a rel="noopener" target="_blank" href="https://thenounproject.com/">the Noun Project</a>.
  </p>`,
  // Settings
  settings: 'Opciones de configuración',
  general: 'General',
  generalSettings: 'Opciones generales',
  showSensitive: 'Mostrar multimedia sensible por defecto',
  showPlain: 'Mostrar un color gris liso para multimedia sensible',
  allSensitive: 'Tratar todo el multimedia como sensible',
  largeMedia: 'Mostrar imágenes y vídeos grandes incrustados',
  autoplayGifs: 'Reproducir automáticamente GIFs animados',
  hideCards: 'Ocultar paneles de previsualización de enlaces',
  underlineLinks: 'Subrayar enlaces en toots y perfiles',
  accessibility: 'Accesibilidad',
  reduceMotion: 'Reducir movimiento en animaciones de la interfaz',
  disableTappable: 'Deshabilitar área para tocar en todo el toot',
  removeEmoji: 'Eliminar emoji de nombres de usuario',
  shortAria: 'Usar etiquetas ARIA cortas para artículos',
  theme: 'Diseño visual',
  themeForInstance: 'Diseño visual para {instance}',
  disableCustomScrollbars: 'Deshabilitar barras deslizantes personalizadas',
  bottomNav: 'Situar la barra de navegación al final de la pantalla',
  centerNav: 'Centrar la barra de navegación',
  preferences: 'Preferencias',
  hotkeySettings: 'Opciones para atajos de teclado',
  disableHotkeys: 'Deshabilitar todos los atajos de teclado',
  leftRightArrows: 'Las flechas izquierda/derecha cambian el foco en vez de columnas/multimedia',
  guide: 'Guía',
  reload: 'Recargar',
  // Wellness settings
  wellness: 'Bienestar',
  wellnessSettings: 'Opciones para el bienestar',
  wellnessDescription: `Las opciones para el bienestar están diseñadas para reducir los aspectos que inducen adicción o ansiedad en las redes sociales.
    Elige cualquier opción que vaya bien para ti.`,
  enableAll: 'Habilitar todos',
  metrics: 'Métricas',
  hideFollowerCount: 'Ocultar recuento de seguidores (hasta 10)',
  hideReblogCount: 'Ocultar recuento de reenvíos',
  hideFavoriteCount: 'Ocultar recuento de favoritos',
  hideUnread: 'Ocultar recuento de notificaciones sin leer (es decir, el punto rojo)',
  // The quality that makes something seem important or interesting because it seems to be happening now
  immediacy: 'Inmediatez',
  showAbsoluteTimestamps: 'Mostrar marcas de tiempo absolutas (p.ej., "3 de marzo") en vez de marcas de tiempo relativas (p. ej., "hace 5 minutos")',
  ui: 'Interfaz',
  grayscaleMode: 'Modo escala de grises',
  wellnessFooter: `Estas opciones están parcialmente basadas en pautas del
    <a rel="noopener" target="_blank" href="https://humanetech.com">Center for Humane Technology</a>.`,
  // This is a link: "You can filter or disable notifications in the _instance settings_"
  filterNotificationsPre: 'Puedes filtrar o deshabilitar notificaciones en',
  filterNotificationsText: 'opciones para instancia',
  filterNotificationsPost: '',
  // Custom tooltips, like "Disable _infinite scroll_", where you can click _infinite scroll_
  // to see a description. It's hard to properly internationalize, so we just break up the strings.
  disableInfiniteScrollPre: 'Deshabilitar',
  disableInfiniteScrollText: 'desplazamiento infinito',
  disableInfiniteScrollDescription: `Cuando el desplazamiento infinito esté deshabilitado, los nuevos toots no se mostrarán automáticamente al final o al principio de la cronología. En vez de esto, habrá botones que te permitirán
             cargar más contenido a demanda.`,
  disableInfiniteScrollPost: '',
  // Instance settings
  loggedInAs: 'Iniciaste sesión como',
  homeTimelineFilters: 'Filtros para la cronología Inicio',
  notificationFilters: 'Filtros para notificaciones',
  pushNotifications: 'Notificaciones Push',
  // Add instance page
  storageError: `Parece que Pinafore no puede almacenar datos localmente. ¿Está tu navegador en modo privado
          o bloqueando las cookies? Pinafore almacena todos los datos localmente, y requiere LocalStorage e
          IndexedDB para funcionar correctamente.`,
  javaScriptError: 'Debes habilitar JavaScript para iniciar sesión.',
  enterInstanceName: 'Introducir nombre de instancia',
  instanceColon: 'Instancia:',
  // Custom tooltip, concatenated together
  getAnInstancePre: "¿No tienes una",
  getAnInstanceText: 'instancia',
  getAnInstanceDescription: 'Una instancia es tu servidor de inicio de Mastodon, por ejemplo, mastodon.social o cybre.space.',
  getAnInstancePost: '?',
  joinMastodon: '¡Unirse a Mastodon!',
  instancesYouveLoggedInTo: "Instancias en las que has iniciado sesión:",
  addAnotherInstance: 'Añadir otra instancia',
  youreNotLoggedIn: "No has iniciado sesión en ninguna instancia.",
  currentInstanceLabel: `{instance} {current, select,
    true {(instancia actual)}
    other {}
  }`,
  // Link text
  logInToAnInstancePre: '',
  logInToAnInstanceText: 'Inicia sesión en una instancia',
  logInToAnInstancePost: 'para empezar a usar Pinafore.',
  // Another custom tooltip
  showRingPre: 'Mostrar siempre',
  showRingText: 'anillo del foco',
  showRingDescription: `El anillo del foco es el contorno que muestra el elemento que actualmente tiene el foco. Por defecto solo semuestra cuando se usa el teclado (no el ratón o un dispositivo táctil), pero puedes elegir mostrarlo siempre.`,
  showRingPost: '',
  instances: 'Instancias',
  addInstance: 'Añadir instancia',
  homeTimelineFilterSettings: 'Opciones para filtros de la cronología Inicio',
  showReblogs: 'Mostrar reenvíos',
  showReplies: 'Mostrar respuestas',
  switchOrLogOut: 'Seleccionar o cerrar sesión en esta instancia',
  switchTo: 'Seleccionar esta instancia',
  switchToInstance: 'Seleccionar instancia',
  switchToNameOfInstance: 'Seleccionar {instance}',
  logOut: 'Cerrar sesión',
  logOutOfInstanceConfirm: '¿Cerrar sesión en {instance}?',
  notificationFilterSettings: 'Opciones para filtros de notificaciones',
  // Push notifications
  browserDoesNotSupportPush: "Tu navegador no admite notificaciones Push.",
  deniedPush: 'Has denegado el permiso para mostrar notificaciones.',
  pushNotificationsNote: 'Observa que solo puedes recibir notificaciones Push para una instancia al mismo tiempo.',
  pushSettings: 'Opciones para notificaciones Push',
  newFollowers: 'Nuevos seguidores',
  reblogs: 'Reenvíos',
  pollResults: 'Resultados de encuesta',
  subscriptions: 'Suscripción a toots',
  needToReauthenticate: 'Tienes que volver a autenticarte para habilitar las notificaciones Push. ¿Cerrr sesión en {instance}?',
  failedToUpdatePush: 'Se ha producido un fallo al actualizar las opciones para notificaciones Push: {error}',
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
